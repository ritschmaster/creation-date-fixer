import { execSync } from 'child_process';

export const mode_direct = (path, new_date, new_time) => {
    if (!new_date)
        throw Error("Date to use has not been set");

    if (!new_time)
        throw Error("Time to use has not been set");

    let date = execSync('date -jf "%Y-%m-%d %H:%M:%S" "' +
        new_date +
        " " +
        new_time +
        '" +%Y-%m-%dT%H:%M:%S%z')
        .toString()
        .replace('\n', '');

    //==========================================================================
    // Convert the date into the ISO 8601 format
    return date;
};
