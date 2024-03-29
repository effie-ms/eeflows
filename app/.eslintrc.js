module.exports = {
    extends: ['@thorgate'],
    settings: {
        'import/ignore': [
            '^@winston$'
        ],
        'import/resolver': {
            node: {
                paths: [
                    'src'
                ],
            },
        },
    },
    rules: {
        // Allow @winston magic import
        'import/no-unresolved': [
            2,
            {
                ignore: [
                    '^@winston$'
                ],
            },
        ],
        "react/jsx-props-no-spreading": "off",
        "react-hooks/exhaustive-deps": "off",
    },
};
