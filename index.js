const { calculateMissingDuration } = require('./util');

(async function () {
    try {
        const response = await calculateMissingDuration();
        console.info(response)
    } catch (err) {
        console.error(err);
    }
})();