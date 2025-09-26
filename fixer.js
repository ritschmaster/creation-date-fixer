import { accessSync, readdirSync, constants } from 'node:fs';
import { execSync } from 'node:child_process';
import { platform } from 'node:os';

import chalk from 'chalk';

import { mode_create_date } from './mode/create_date.js';
import { mode_facebook } from './mode/facebook.js';
import { mode_whatsapp } from './mode/whatsapp.js';
import { mode_original } from './mode/original.js';
import { mode_modif_date } from './mode/modif_date.js';
import { mode_direct } from './direct.js';

export default class Fixer {
    static Modes = Object.freeze({
        CREATE_DATE: 0,
        FACEBOOK: 1,
        WHATSAPP: 2,
        ORIGINAL: 3,
        MODIF_DATE: 4,
        DIRECT: 5
    })

    constructor() {
        this.paths = null
        this.mode = null
        this.date = null
        this.time = null
        this.test_mode = false
        this.recursive = false
    }

    /**
     * 
     * @param {Array<string>} paths The paths to modify
     * @returns 
     */
    set_paths(paths) {
        this.paths = paths

        return this
    }

    /**
     * 
     * @returns Array<string> The paths to modify
     */
    get_paths() {
        return this.paths
    }

    set_mode(mode) {
        this.mode = mode

        return this
    }

    get_mode() {
        return this.mode
    }

    set_date(date) {
        // TODO check if date

        this.date = date

        return this
    }

    get_date() {
        return this.date
    }

    set_time(time) {
        // TODO check if time

        this.time = time

        return this
    }

    get_time() {
        return this.time
    }

    /**
     * 
     * @param {boolean} test_mode Enable/disable the test mode
     * @returns This instance for chaining
     */
    set_test_mode(test_mode) {
        this.test_mode = test_mode

        return this
    }

    /**
     * 
     * @returns boolean True if test mode is enabled, false otherwise
     */
    get_test_mode() {
        return this.test_mode
    }

    /**
     * 
     * @param {boolean} recurisve Enable/disable recursive reading of 
     * directories
     * @returns This instance for chaining
     */
    set_recursive(recurisve) {
        this.recursive = recurisve

        return this
    }

    /**
     * 
     * @returns boolean True if recursive reading of directories is enabled, 
     * false otherwise
     */
    get_recursive() {
        return this.recursive
    }

    /**
     * 
     * @param {string} path The path to modify
     * @param {Date} date The date to set
     */
    get_modification_command(path, date) {
        let my_platform = platform()
        if (my_platform === 'darwin') {
            //=================================================================
            // We are on macOS  
            return 'SetFile -d "' + 
                date.toLocaleString('en-US') + 
                '" "' + 
                path + 
                '"'
        } else {
            //=================================================================
            // We do not know the platform. Therefore, we throw an exception.
            throw Error('You are running platform ' + my_platform + '.' + '\n' +
                        'This platform is not supported yet.' + '\n' +
                        'Supported platforms are: ' + '\n' + 
                        '1. macOS (darwin)')
        }
    }

    /**
     * 
     * @param {string} path The path to modify
     */
    fix_image(path) {
        //=====================================================================
        // Determine the variable date by using the variable mode
        let date = ''
        let mode = this.get_mode()
        switch (mode) {
            case Fixer.Modes.CREATE_DATE:
                date = mode_create_date(path)
                break

            case Fixer.Modes.FACEBOOK:
                date = mode_facebook(path)
                break

            case Fixer.Modes.MODIF_DATE:
                date = mode_modif_date(path)
                break

            case Fixer.Modes.ORIGINAL:
                date = mode_original(path)
                break

            case Fixer.Modes.WHATSAPP:
                date = mode_whatsapp(path)
                break

            case Fixer.Modes.DIRECT:
                date = mode_direct(path, this.get_date(), this.get_time())
                break

            default:
                throw Error('Mode ' + mode + ' not implemented');
        }

        //=====================================================================
        // Create the final command to modify the file
        let modificationCommand = this.get_modification_command(path, date)

        //=====================================================================
        // Check if in test mode
        // If yes: print the command to be executed
        // If no: execute the command
        if (this.get_test_mode())
            console.log(chalk.green.bold(modificationCommand))
        else
            execSync(modificationCommand)
    }

    fix() {
        //=====================================================================
        // Get the paths
        let paths = this.get_paths();

        //=====================================================================
        // Throw an error if paths is (still) null
        if (!paths)
            throw Error('Paths not defined');

        let recursive = this.get_recursive()

        paths.forEach(path => {
            //=================================================================
            // Exit out if the path is not readable
            accessSync(path, constants.R_OK)

            //=================================================================
            // Check if the path is a directory
            try {
                //=============================================================
                // Consume the directory entries
                let dirEntries = readdirSync(path, {
                    recursive: recursive
                })
                dirEntries.forEach(finalPathBasename => {
                    //=========================================================
                    // Check if the final path is a directory again
                    const finalPath = path + '/' + finalPathBasename
                    try {
                        //=====================================================
                        // Skip a directory
                        readdirSync(finalPath)
                    } catch {
                        //=====================================================
                        // Consume a file
                        this.fix_image(finalPath)
                    }
                })
            } catch (readddirError) {
                //=============================================================
                // Consume the path
                this.fix_image(path)
            }
        });
    }
}