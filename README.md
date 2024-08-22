# Creation date fixer

## What is it?

Executing `creation-date-fixer -h` says it all:

    Usage: creation-date-fixer [options] <paths...>
    
    Fixes the creation date attribute of an image file. This can be handy before importing into Apple Photos as that product is consuming the creation
    date attribute.
    
    The possible modes are:
    c   Using the EXIF "Creation Date"
    f   Using the filename of Facebook images
    m   Using the EXIF "Modification Date"
    o   Using the EXIF "Original Date"
    w   Using the filename of Whatsapp images
    d   Using the options -d and -t to define a date and time to use
    
    Arguments:
      paths              Paths to convert. If a directory is given, then all files within that directory are converted (except for further sub
                         directories).
    
    Options:
      -m, --mode <mode>  Mode to use. See the description for more information. (default: "c")
      -d, --date <date>  The date to use in the format YYYY-MM-DD (e.g. 2024-08-16). (default: null)
      -t, --time <time>  The time to use in the format HHH:MM:SS (e.g. 13:14:15). (default: null)
      -u, --test         Run the application only in test mode. The conversion to be done will be printed.
      -r, --recursive    If a directory is passed in, then it is read recursively (i.e. sub directories are considered too). Be very careful if you use
                         this option as all files are considered to be images!
      -h, --help         display help for command

## Install

1. `git clone https://github.com/ritschmaster/creation-date-fixer`
2. `cd creation-date-fixer`
3. `npm link``

## Uninstall

1. `cd creation-date-fixer``
2. `npm uninstall -g`