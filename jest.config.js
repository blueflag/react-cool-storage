// @flow
module.exports = {
    preset: 'blueflag-test',
    collectCoverageFrom: [
        "packages/**/*.{js,jsx}",
        "!**/lib/**",
        "!**/node_modules/**"
    ],
    testMatch: ["**/__test__/**/*-test.js?(x)"],
    testURL: 'http://localhost',
    setupFiles: ["jest-localstorage-mock"]
};
