
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function insertStringBeforeCapital(string) {
    return string.replace(/([A-Z])/g, ' $1').trim()
}
