/**
 * Creates a promise that resolves after the given amount of time
 *
 * @param {number} seconds
 * @returns {Promise<void>}
 */
export function sleep(seconds) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    });
}
