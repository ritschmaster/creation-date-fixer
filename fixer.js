import { accessSync, constants } from 'node:fs';
import { execSync } from 'node:child_process';

/**
  * @param {string} path Path to extract the creation date for. The path is expected to be existing.
  * @returns {string} Creation date for touch
  */
const mode_create_date = (path)  => {
    let creation_date = execSync('exiftool -\'CreateDate\' "' + path + '" | cut -d\' \' -f24')
        .toString()
        .replace('\n', '')
    let creation_time = execSync('exiftool -\'CreateDate\' "' + path + '" | cut -d\' \' -f25')
        .toString()
        .replace('\n', '')

    if (creation_date.length <= 0)
        throw Error("Unable to get creation date from file " + path)

    if (creation_time.length <= 0)
        throw Error("Unable to get creation time from file " + path)

    let date = execSync('date -jf "%Y:%m:%d%T" "' + creation_date + creation_time + '" +%Y%m%d%H%M.%S')
        .toString()
        .replace('\n', '')

    return date    
}

const mode_facebook = (path) => {
    let match = execSync('ls "' + path + '" | grep -o "[0-9]*" | head -n 1')
        .toString()
        .replace('\n', '')

    if (match.length <= 0)
        throw Error('File ' + path + ' does not fullfill the Facebook pattern')

    let date = execSync('date -jf "%Y-%m-%d_%H-%M-%S" "' + match + '" +%Y%m%d%H%M.%S')
        .toString()
        .replace('\n', '')

    return date    
}

const mode_whatsapp = (path) => {
    let match = execSync('ls "' + path + '" | grep -o "[0-9]*" | head -n 1')
        .toString()
        .replace('\n', '')

    if (match.length <= 0)
        throw Error('File ' + path + ' does not fullfill the Whatsapp pattern')

    let date = execSync('date -jf "%Y%m%d" "' + match + '" +%Y%m%d%H%M.%S')
        .toString()
        .replace('\n', '')

    return date
}

const mode_original = (path) => {
    let creation_date = execSync('exiftool -\'DateTimeOriginal\' "' + path + '" | cut -d\' \' -f17')
        .toString()
        .replace('\n', '')
    let creation_time = execSync('exiftool -\'DateTimeOriginal\' "' + path + '" | cut -d\' \' -f18')
        .toString()
        .replace('\n', '')

    if (creation_date.length <= 0)
        throw Error("Unable to get creation date from file " + path)

    if (creation_time.length <= 0)
        throw Error("Unable to get creation time from file " + path)

    let date = execSync('date -jf "%Y:%m:%d%T" "' + creation_date + creation_time + '" +%Y%m%d%H%M.%S')
        .toString()
        .replace('\n', '')

    return date    
}

const mode_modif_date = (path) => {
    let creation_date = execSync('exiftool -\'DateTimeOriginal\' "' + path + '" | grep \'File Modification Date/Time\' | cut -d\' \' -f9')
        .toString()
        .replace('\n', '')
    let creation_time = execSync('exiftool -\'DateTimeOriginal\' "' + path + '" | grep \'File Modification Date/Time\' | cut -d\' \' -f10')
        .toString()
        .replace('\n', '')

    if (creation_date.length <= 0)
        throw Error("Unable to get creation date from file " + path)

    if (creation_time.length <= 0)
        throw Error("Unable to get creation time from file " + path)

    let date = execSync('date -jf "%Y:%m:%d%T" "' + creation_date + creation_time + '" +%Y%m%d%H%M.%S')
        .toString()
        .replace('\n', '')

    return date    
}

const mode_direct = (path, new_date, new_time) => {
    if (!new_date)
        throw Error("Date to use has not been set")

    if (!new_time)
        throw Error("Time to use has not been set")

    let date = execSync('date -jf "%Y-%m-%d %H:%M:%S" "' + new_date + " " + new_time + '" +%Y%m%d%H%M.%S')
        .toString()
        .replace('\n', '')

    return date    
}

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
    }

    set_paths(paths) {
        this.paths = paths

        return this
    }

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

    fix_image() {
        //=====================================================================
        // Get the paths
        let paths = this.get_paths();

        //=====================================================================
        // Throw an error if paths is (still) null
        if (!paths)
            throw Error('Paths not defined');

        let date = ''
        let mode = this.get_mode()

        paths.forEach(path => {
            //=================================================================
            // Exit out if the path is not readable
            accessSync(path, constants.R_OK)

            //=================================================================
            // Determine the variable date by using the variable mode
            switch(mode) {
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
                    throw Error('Mode ' + mode + ' not implemented' );
            }

            //=================================================================
            // Use the date to modify the file
            execSync('touch -t "' + date + '" "' + path + '"')
        });
    } 
}