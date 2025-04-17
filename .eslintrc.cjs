module.exports = {
    root: true,
    env: { es2020: true, browser: true, node: true },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    ],
    parserOptions: { ecmaVersion: 2020, sourceType: "module", ecmaFeatures: { jsx: true } },
    settings: { react: { version: "detect" } },
    ignorePatterns: ["dist/**"],
};
