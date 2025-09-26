import { execSync } from 'child_process';

/**
  * @param {string} path Path to extract the creation date for. The path is 
  * expected to be existing.
  * @returns {Date} The date to use as the creation date of the file.
  */
export const mode_whatsapp = (path) => {
    let match = execSync('ls "' + path + '" | grep -o "[0-9]*" | head -n 1')
        .toString()
        .replace('\n', '');

    if (match.length <= 0)
        throw Error('File ' + path + ' does not fullfill the Whatsapp pattern');

    //==========================================================================
    // Convert the date into the ISO 8601 format
    let date = execSync('date -jf "%Y%m%d" "' +
        match +
        '" +%Y-%m-%dT%H:%M:%S%z')
        .toString()
        .replace('\n', '');

    //==========================================================================
    // Convert the date into the ISO 8601 format
    return new Date(date);
};
