const palindrome = (string) => {
    if (typeof string === 'undefined') {
        return
    }

    return string.split('').reverse().join('')
}

const average = array => {
    if (array.length === 0) {
        return 0
    }
    
    let sum = 0
    array.map(num => sum += num )
    return sum / array.length
}

module.exports = {
    palindrome,
    average
}