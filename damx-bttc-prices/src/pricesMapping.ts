import { BigInt } from "@graphprotocol/graph-ts";

import {
  CandlePrice,
  ChainlinkPrice,
} from "../generated/schema";

import { PriceData as PriceDataEvent } from "../generated/FastPriceFeed/FastPriceFeed";

function _storeChainlinkPrice(
  token: string,
  value: BigInt,
  timestamp: BigInt
): void {
  _storeCandlePrice(token, value, "5m", timestamp);
  _storeCandlePrice(token, value, "15m", timestamp);
  _storeCandlePrice(token, value, "1h", timestamp);
  _storeCandlePrice(token, value, "4h", timestamp);
  _storeCandlePrice(token, value, "1d", timestamp);

  let totalEntity = new ChainlinkPrice(token);
  totalEntity.value = value;
  totalEntity.period = "last";
  totalEntity.token = token;
  totalEntity.timestamp = timestamp.toI32();
  totalEntity.save();
}

function _storeCandlePrice(
  token: string,
  value: BigInt,
  period: string,
  timestamp: BigInt
): void {
  
  let periodSeconds = "";
  if (period === "5m") {
    periodSeconds = "300";
  } else if (period === "15m") {
    periodSeconds = "900";
  } else if (period === "1h") {
    periodSeconds = "3600";
  } else if (period === "4h") {
    periodSeconds = "14400";
  } else if (period === "1d") {
    periodSeconds = "86400";
  }

  let timestampMod = timestamp.minus(
    timestamp.mod(BigInt.fromString(periodSeconds))
  ); // 5min
  let id = token + ":" + period + ":" + timestampMod.toString();
  let prevId = token + ":" + period + ":" + timestampMod.minus(BigInt.fromString(periodSeconds)).toString();

  let entity = CandlePrice.load(id);
  if (entity == null) {
    entity = new CandlePrice(id);
    entity.token = token;
    entity.period = period;
    entity.open = value;
    entity.high = value;
    entity.low = value;

    let prevEntity = CandlePrice.load(prevId);
    if(prevEntity){
      prevEntity.close = value;
      prevEntity.high = value.gt(prevEntity.high) ? value : prevEntity.high;
      prevEntity.low = value.lt(prevEntity.low) ? value : prevEntity.low;
      prevEntity.save()
    }

  } else {
    entity.high = value.gt(entity.high) ? value : entity.high;
    entity.low = value.lt(entity.low) ? value : entity.low;
  }

  entity.close = value;
  entity.period = period;
  entity.timestamp = timestampMod.toI32();
  entity.save();
}

export function handlePriceData(event: PriceDataEvent): void {
  _storeChainlinkPrice(event.params.token.toHexString(), event.params.refPrice, event.block.timestamp);
}