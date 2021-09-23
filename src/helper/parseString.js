/* eslint-disable import/prefer-default-export */
function getRestString(string, left, right) {
  return string ? `${string.substr(0, left)}...${string.substr(-right)}` : '';
}

function prefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}

export { getRestString, prefixInteger };
