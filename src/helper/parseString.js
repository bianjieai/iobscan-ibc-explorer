/* eslint-disable import/prefer-default-export */
import { floor } from 'lodash';

function getRestString(string, left, right) {
  return string ? `${string.substr(0, left)}...${string.substr(-right)}` : '';
}

function getLasttyString(string) {
  return string && string.length > 20 ? `${string.substr(0, 10)}...` : string;
}

function prefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}

function JSONparse(val) {
  let result = null;
  try {
    result = JSON.parse(val);
  } catch (d) {
    result = {};
  }
  return result;
}

function formatNum(numOrigin) {
  const num = Number(numOrigin);
  const billion = 1000000000;
  const million = 1000000;
  const thousand = 1000;
  const thousandDecimal = 0.0001;
  let result = 0;
  if (num >= billion) {
    result = `${Math.floor(num / billion)} B`;
  } else if (num >= million) {
    result = `${Math.floor(num / million)} M`;
  } else if (num >= thousand) {
    result = Math.floor(num);
  } else if (num <= thousandDecimal) {
    result = `< ${thousandDecimal}`;
  } else {
    result = floor(num, 4);
  }
  return result;
}

export {
  getRestString, prefixInteger, JSONparse, formatNum, getLasttyString,
};
