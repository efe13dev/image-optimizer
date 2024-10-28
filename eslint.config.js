import love from 'eslint-config-love';

export default [
  {
    ...love,
    files: ['**/*.js', '**/*.ts']
  },
  {
    rules: {
      semi: 'error'
    }
  }
];
