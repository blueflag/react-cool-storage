// @flow
module.exports = {
    preset: 'blueflag-test',
    collectCoverageFrom: [
        "src/**/*.{js,jsx}",
        "!**/lib/**",
        "!**/node_modules/**",
        "!**/__test__/**"
    ],
    testMatch: ["**/__test__/**/*-test.js?(x)"],
    testURL: 'http://localhost',
    setupFiles: ["jest-localstorage-mock"],
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 97,
            functions: 94,
            lines: 100
        }
    }
};
