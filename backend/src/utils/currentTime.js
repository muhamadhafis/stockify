function currentTime(min = 0) {
    const date = new Date()
    date.setMinutes(date.getMinutes() + min)

    return date.toLocaleString('sv-SE', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).replace('T', ' ')
}
module.exports = currentTime