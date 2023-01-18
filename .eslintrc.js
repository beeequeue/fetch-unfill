/** @type import("eslint-define-config").ESLintConfig */
module.exports = {
  root: true,
  ignorePatterns: ["*eslintrc*"],
  extends: ["plugin:@beequeue/base", "plugin:@beequeue/typescript"],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
  },

  overrides: [
    {
      files: ["**/*.config.ts", "**/*.test.ts"],
      parserOptions: {
        project: "tsconfig.tests.json",
      },
    },
  ],
}
