/* eslint-disable no-nested-ternary */
export default class Tools {
  /**
   * 根据展示的需求拼接字符串展示成 > xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs
   */
  static formatAge(currentServerTime, time, suffix, prefix) {
    const dateBegin = new Date(time);
    const dateDiff = currentServerTime - dateBegin.getTime() / 1000;
    if (dateDiff < 0) {
      return '';
    }
    const dayDiff = Math.floor(dateDiff / (24 * 3600));
    const hourLevel = dateDiff % (24 * 3600);
    const hours = Math.floor(hourLevel / 3600);
    const minuteLevel = dateDiff % 3600;
    const minutes = Math.floor(minuteLevel / 60);
    const seconds = dateDiff % 60;

    // eslint-disable-next-line no-nested-ternary
    const str = `${dayDiff ? (dayDiff < 2 ? `${dayDiff} day` : `${dayDiff} days`) : ''} ${
      hours ? (hours < 2 ? `${hours} hr` : `${hours} hrs`) : ''
    } ${dayDiff ? '' : minutes ? (minutes < 2 ? `${minutes} min` : `${minutes} mins`) : ''} ${
      dayDiff || hours ? '' : seconds ? (seconds < 2 ? `${seconds} sec` : `${seconds} secs`) : ''
    }`;

    if (prefix && suffix) {
      return `${prefix} ${str} ${suffix}`;
    }
    if (suffix) {
      return `${str} ${suffix}`;
    }
    return `${str}`;
  }

  static getTimestamp() {
    return Math.floor(new Date().getTime() / 1000);
  }

  static findDenomSymbol(ibcDenoms, denomStr, chainId) {
    if (ibcDenoms) {
      const findDenom = ibcDenoms.find(
        (denom) => denom.denom === denomStr && denom.chain_id === chainId,
      );
      if (findDenom) {
        return findDenom.symbol;
      }
    }
    return false;
  }

  static findSymbol(ibcBaseDenoms, symbol) {
    if (ibcBaseDenoms) {
      const findBaseDenom = ibcBaseDenoms.find((baseDenom) => baseDenom.symbol === symbol);
      if (findBaseDenom) {
        return findBaseDenom;
      }
    }
    return null;
  }

  static parseSymbolNum(num) {
    if (num > 999) {
      return Math.floor(num);
    }
    return num.toFixed(4);
  }
}
