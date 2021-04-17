const unCamelCase = string => {
    // insert a space before all caps
    return string.replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, str => str.toUpperCase());
}

const toCommaSeparatedList = arr => {
    let string = arr.join(', ');
    let n = string.lastIndexOf(',');
    if (n > -1) {
        return string.substr(0, n) + ' and' + string.substr(n+1);
    }
}