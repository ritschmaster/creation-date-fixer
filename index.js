#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

import Fixer from './fixer.js';

const program = new Command();
program
    .description(`Fixes the creation date attribute of an image file. This can be handy before importing into Apple Photos as that product is consuming the creation date attribute.

The possible modes are:
c   Using the EXIF "Creation Date"
f   Using the filename of Facebook images
m   Using the EXIF "Modification Date"
o   Using the EXIF "Original Date"
w   Using the filename of Whatsapp images
d   Using the options -d and -t to define a date and time to use`)
    .argument('<paths...>', 'Paths to convert. If a directory is given, then all files within that directory are converted (except for further sub directories).')
    .option('-m, --mode <mode>', `Mode to use. See the description for more information.`, 'c')
    .option('-d, --date <date>', `The date to use in the format YYYY-MM-DD (e.g. 2024-08-16).`, null)
    .option('-t, --time <time>', `The time to use in the format HHH:MM:SS (e.g. 13:14:15).`, null)
    .option('-u, --test', `Run the application only in test mode. The conversion to be done will be printed.`)
    .option('-r, --recursive', `If a directory is passed in, then it is read recursively (i.e. sub directories are considered too). Be very careful if you use this option as all files are considered to be images!`)
    .action((paths, options) => {
        const fixer = new Fixer();
        switch (options.mode) {
            case 'c':
                fixer.set_mode(Fixer.Modes.CREATE_DATE)
                break;
            
            case 'f':
                fixer.set_mode(Fixer.Modes.FACEBOOK)
                break

            case 'm':
                fixer.set_mode(Fixer.Modes.MODIF_DATE)
                break
            
            case 'o':
                fixer.set_mode(Fixer.Modes.ORIGINAL)
                break

            case 'w':
                fixer.set_mode(Fixer.Modes.WHATSAPP)
                break

            case 'd':
                fixer
                    .set_date(options.date)
                    .set_time(options.time)
                    .set_mode(Fixer.Modes.DIRECT)
        }

        if (options.test)
            fixer.set_test_mode(true)

        if (options.recursive)
            fixer.set_recursive(true)

        try {
            fixer
                .set_paths(paths)
                .fix()
        } catch (err) {
            //=================================================================
            // Output the error
            console.error(chalk.red.bold(err.toString()))
            return
        }
    });

program.parse();