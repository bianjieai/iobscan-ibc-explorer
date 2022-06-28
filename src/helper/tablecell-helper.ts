/**
 * @description format tableCell
 */

import { isString } from "./object-helper"
import { formatBigNumber, formatNum } from "./parseString"

/**
 * 
 * @param price 价格 不超过10w
 * @param numberOfDecimal 4位小数
 * @returns $ xxx
 */
export const formatPrice = (price: number | string, numberOfDecimal: number = 4) => {
  if (price === -1 || price === '-1') {
    return `--`
  }

  const _formatNum = formatNum(price)
  if (isString(_formatNum)) {
    return `${_formatNum}`
  } else {
    return `${formatBigNumber(_formatNum, numberOfDecimal)}`
  }
}

export const formatSupply = (supply: number | string, numberOfDecimal: number = 2) => {
  if (supply === -1 || supply === '-1') {
    return `--`
  }

  return formatBigNumber(supply, numberOfDecimal)
}


export const formatAmount = (amount: number | string, numberOfDecimal: number = 2) => {
  if (amount === -1 || amount === '-1' || amount === '') {
    return `--`
  }

  return formatBigNumber(amount, numberOfDecimal)
}

export const formatTransfer_success_txs = (transfer_success_txs: number, transfer_total_txs: number) => {
  if (transfer_total_txs === 0) return 0
  return ((transfer_success_txs / transfer_total_txs) * 100).toFixed(0)
}
