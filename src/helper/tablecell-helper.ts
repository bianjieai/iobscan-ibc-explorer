/**
 * @description format tableCell
 */

import { TBaseDenoms } from "@/hooks/chainAndDenom.interface"
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

const getScale = (denom?: string, baseDenomData?: TBaseDenoms[]) => {
  if (Array.isArray(baseDenomData) && denom) {
    const filterData = baseDenomData.filter(item => item.denom === denom)
    if (filterData.length > 0) {
      return filterData[0].scale ?? 0
    } else {
      return 0
    }
  } else {
    return 0
  }
}

export const formatSupply = (supply: number | string, denom: string, baseDenomData: TBaseDenoms[], numberOfDecimal: number = 2) => {
  if (supply === -1 || supply === '-1') {
    return `--`
  }
  const scale = getScale(denom, baseDenomData)
  let result = 0

  if (scale > 0) {
    result = Number(supply) / Math.pow(10, scale)
  } else {
    result = Number(supply)
  }

  return formatBigNumber(result, numberOfDecimal)
}


export const formatAmount = (amount: number | string, denom?: string, baseDenomData?: TBaseDenoms[], numberOfDecimal: number = 2) => {
  if (amount === -1 || amount === '-1' || amount === '') {
    return `--`
  }
  if (!denom && !baseDenomData) return formatBigNumber(amount, numberOfDecimal)
  const scale = getScale(denom, baseDenomData)
  let result = 0

  if (scale > 0) {
    result = Number(amount) / Math.pow(10, scale)
  } else {
    result = Number(amount)
  }

  return formatBigNumber(result, numberOfDecimal)
}

export const formatTransfer_success_txs = (transfer_success_txs: number, transfer_total_txs: number) => {
  if (transfer_total_txs === 0) return 0
  return ((transfer_success_txs / transfer_total_txs) * 100).toFixed(0)
}
