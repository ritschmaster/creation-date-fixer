import { execSync } from 'child_process';

/**
  * @param {string} path Path to extract the creation date for. The path is 
  * expected to be existing.
  * @returns {string} Creation date for touch
  */
export const mode_original = (path) => {
    let creation_date = execSync('exiftool -\'DateTimeOriginal\' "' +
        path +
        '" | cut -d\' \' -f17')
        .toString()
        .replace('\n', '');
    let creation_time = execSync('exiftool -\'DateTimeOriginal\' "' +
        path +
        '" | cut -d\' \' -f18')
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
