import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default [
    {
        ignores: ['coverage/*', 'node_modules/*', 'build/*', '.prettierrc.js'],
    },
    ...compat.extends('prettier', 'eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
        },

        rules: {
            'no-console': 'error',
            'no-process-env': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 0,
            '@typescript-eslint/camelcase': 0,
            '@typescript-eslint/no-var-requires': 0,
        },
    },
]
