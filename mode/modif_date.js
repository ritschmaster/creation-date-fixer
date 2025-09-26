import { execSync } from 'child_process';

/**
  * @param {string} path Path to extract the creation date for. The path is 
  * expected to be existing.
  * @returns {Date} The date to use as the creation date of the file.
  */
export const mode_modif_date = (path) => {
    let creation_date = execSync('exiftool -\'DateTimeOriginal\' "' +
        path +
        '" | grep \'File Modification Date/Time\' | cut -d\' \' -f9')
        .toString()
        .replace('\n', '');
    let creation_time = execSync('exiftool -\'DateTimeOriginal\' "' +
        path +
        '" | grep \'File Modification Date/Time\' | cut -d\' \' -f10')
        .toString()
        .replace('\n', '');

    if (creation_date.length <= 0)
        throw Error("Unable to get creation date from file " + path);

    if (creation_time.length <= 0)
        throw Error("Unable to get creation time from file " + path);

    //==========================================================================
    // Convert the date into the ISO 8601 format
    let date = execSync('date -jf "%Y:%m:%d%T" "' +
        creation_date +
        creation_time +
        '" +%Y-%m-%dT%H:%M:%S%z')
        .toString()
        .replace('\n', '');

    //==========================================================================
    // Convert the date into the ISO 8601 format
    return new Date(date);
};
