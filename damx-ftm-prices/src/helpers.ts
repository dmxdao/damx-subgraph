import { BigInt, TypedMap } from "@graphprotocol/graph-ts";
import { ChainlinkPrice } from "../generated/schema";

export let BASIS_POINTS_DIVISOR = BigInt.fromI32(10000);
export let PRECISION = BigInt.fromI32(10).pow(30);

export let BTC = "0x321162cd933e2be498cd2267a90534a804051b11";
export let WETH = "0x74b23882a30290451a17c44f4f05243b6b58c76d";
export let WFTM = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83";
export let USDC = "0x04068da6c83afcfa0e13ba15a6696662335d5b75";
export let USDT = "0x049d68029688eabf473097a2fc38ef61633a3c7a";
export let DAI = "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e";
export let GMX = "0x0ec581b1f76ee71fb9feefd058e0ecf90ebab63e";

export function getTokenDecimals(token: String): u8 {
  let tokenDecimals = new Map<String, i32>();
  tokenDecimals.set(BTC, 8);
  tokenDecimals.set(WETH, 18);
  tokenDecimals.set(WFTM, 18);
  tokenDecimals.set(USDC, 6);
  tokenDecimals.set(USDT, 6);
  tokenDecimals.set(DAI, 18);
  tokenDecimals.set(GMX, 18);

  return tokenDecimals.get(token) as u8;
}

export function getTokenAmountUsd(token: String, amount: BigInt): BigInt {
  let decimals = getTokenDecimals(token);
  let denominator = BigInt.fromI32(10).pow(decimals);
  let price = getTokenPrice(token);
  return (amount * price) / denominator;
}

export function getTokenPrice(token: String): BigInt {
  let chainlinkPriceEntity = ChainlinkPrice.load(token);
  if (chainlinkPriceEntity != null) {
    // all chainlink prices have 8 decimals
    // adjusting them to fit GMX 30 decimals USD values
    return chainlinkPriceEntity.value * BigInt.fromI32(10).pow(22);
  }

  let prices = new TypedMap<String, BigInt>();
  prices.set(WETH, BigInt.fromI32(1800) * PRECISION);
  prices.set(BTC, BigInt.fromI32(25000) * PRECISION);
  prices.set(WFTM, (BigInt.fromI32(4) * PRECISION) / BigInt.fromI32(10).pow(1));
  prices.set(USDC, PRECISION);
  prices.set(USDT, PRECISION);
  prices.set(DAI, PRECISION);
  prices.set(GMX, (BigInt.fromI32(5) * PRECISION) / BigInt.fromI32(10).pow(3));

  return prices.get(token) as BigInt;
}
