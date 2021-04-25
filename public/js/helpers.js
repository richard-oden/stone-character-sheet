const unCamelCase = string => {
    return string
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
}

const toCommaSeparatedList = arr => {
    let string = arr.join(', ');
    let n = string.lastIndexOf(',');
    if (n > -1) {
        return string.substr(0, n) + ' and' + string.substr(n+1);
    }
}

const shortenResourceName = name => {
    return name
        .replace(/ *\([^)]*\) */g, "")
        .replace('Invoke', '')
        .trim();
}

const compareObjectsByName = (obj1, obj2) => {
    if ( obj1.name < obj2.name ) {
        return -1;
    }
    if ( obj1.name > obj2.name ) {
        return 1;
    }
    return 0;
}