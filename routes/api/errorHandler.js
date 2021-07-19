module.exports = function errorHandler(error) {
    let errorObj = {}
    for (key in error.errors) {
        errorObj[key] = error.errors[key].properties.message
    }
    return errorObj
}