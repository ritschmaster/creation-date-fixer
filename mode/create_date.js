import { execSync } from 'node:child_process';

/**
  * @param {string} path Path to extract the creation date for. The path is 
  * expected to be existing.
  * @returns {Date} The date to use as the creation date of the file.
  */
export const mode_create_date = (path) => {
    let creation_date = execSync('exiftool -\'CreateDate\' "' + 
                                    path + 
                                    '" | cut -d\' \' -f24')
        .toString()
        .replace('\n', '')
    let creation_time = execSync('exiftool -\'CreateDate\' "' + 
                                    path + 
                                    '" | cut -d\' \' -f25')
        .toString()
        .replace('\n', '')

    if (creation_date.length <= 0)
        throw Error("Unable to get creation date from file " + path)

    if (creation_time.length <= 0)
        throw Error("Unable to get creation time from file " + path)

    //==========================================================================
    // Convert the date into the ISO 8601 format
    let date = execSync('date -jf "%Y:%m:%d%T" "' + 
                        creation_date + 
                        creation_time + 
                        '" +%Y-%m-%dT%H:%M:%S%z')
        .toString()
        .replace('\n', '')

    //==========================================================================
    // Create a Date object using the ISO 8601 format and return it
    return new Date(date)    
}