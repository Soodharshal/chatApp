const reusableFxn = (username,text) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username
    }
}

const reusableLocationFxn = (username,text) => {
    return {
        url: text,
        createdAt: new Date().getTime(),
        username
    }
}

module.exports = {
    reusableFxn, reusableLocationFxn
}