/* eslint-disable import/prefer-default-export */
const env = process.env.NODE_ENV;

console.log(env);
const BASE_URL = env === 'development'
  ? 'http://localhost:3000'
  : 'http://localhost:3000';

export { BASE_URL };
