import { BigInt, TypedMap } from "@graphprotocol/graph-ts"
import {
  ChainlinkPrice,
  UniswapPrice
} from "../generated/schema"

export let BASIS_POINTS_DIVISOR = BigInt.fromI32(10000)
export let PRECISION = BigInt.fromI32(10).pow(30)

export let WETH = "0x51d3d0bf13b34494a25f64cb80b488490df19c27"
export let BTC = "0x9f61fff4a8a68cf4a624b16e322455307b4a5657"
export let WBTT = "0xdc332535823a197cf0a5e3116d319a1eea960b67"
export let USDC = "0x379ea428a503696a312942c4b3846ee4302e8871"
export let USDT = "0xbd2ad37982ce8e92138d113852b0b8a2fe98ee86"
export let TRX = "0x472edaeab8cc3f7ee5b26f1cf16e7bc8c99336ff"
export let DMX = "0x8184f56229d0e72273b5c900c3c9511b05cf444c"

export function timestampToDay(timestamp: BigInt): BigInt {
  return timestampToPeriod(timestamp, "daily")
}

export function timestampToPeriod(timestamp: BigInt, period: string): BigInt {
  let periodTime: BigInt

  if (period == "daily") {
    periodTime = BigInt.fromI32(86400)
  } else if (period == "hourly") {
    periodTime = BigInt.fromI32(3600)
  } else if (period == "weekly" ){
    periodTime = BigInt.fromI32(86400 * 7)
  } else {
    throw new Error("Unsupported period " + period)
  }

  return timestamp / periodTime * periodTime
}

export function getTokenDecimals(token: String): u8 {
  let tokenDecimals = new Map<String, i32>()
  tokenDecimals.set(WETH, 18)
  tokenDecimals.set(BTC, 8)
  tokenDecimals.set(WBTT, 18)
  tokenDecimals.set(USDC, 6)
  tokenDecimals.set(USDT, 6)
  tokenDecimals.set(TRX, 6)
  tokenDecimals.set(DMX, 18)

  return tokenDecimals.get(token) as u8
}

export function getTokenAmountUsd(token: String, amount: BigInt): BigInt {
  let decimals = getTokenDecimals(token)
  let denominator = BigInt.fromI32(10).pow(decimals)
  let price = getTokenPrice(token)
  return amount * price / denominator
}

export function getTokenPrice(token: String): BigInt {
  if (token != DMX) {
    let chainlinkPriceEntity = ChainlinkPrice.load(token)
    if (chainlinkPriceEntity != null) {
      // all chainlink prices have 18 decimals
      // adjusting them to fit DMX 30 decimals USD values
      return chainlinkPriceEntity.value * BigInt.fromI32(10).pow(12)
    }
  }

  if (token == DMX) {
    let uniswapPriceEntity = UniswapPrice.load(DMX)

    if (uniswapPriceEntity != null) {
      return uniswapPriceEntity.value
    }
  }

  let prices = new TypedMap<String, BigInt>()
  prices.set(WETH, BigInt.fromI32(4000) * PRECISION)
  prices.set(BTC, BigInt.fromI32(50000) * PRECISION)
  prices.set(WBTT, BigInt.fromI32(5) * PRECISION / BigInt.fromI32(10).pow(3))
  prices.set(USDC, PRECISION)
  prices.set(USDT, PRECISION)
  prices.set(TRX, BigInt.fromI32(6) * PRECISION / BigInt.fromI32(10).pow(2))
  prices.set(DMX, BigInt.fromI32(30) * PRECISION)

  return prices.get(token) as BigInt
}
