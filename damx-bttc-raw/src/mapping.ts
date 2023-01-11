import { BigInt, ethereum } from "@graphprotocol/graph-ts"
import * as vault from "../generated/Vault/Vault"
import * as positionRouter from "../generated/PositionRouter/PositionRouter"
import * as dlpManager from "../generated/DlpManager/DlpManager"
import * as rewardRouter from "../generated/RewardRouterV2/RewardRouterV2"
import {
  CollectMarginFee,
  CollectSwapFee,
  AddLiquidity,
  RemoveLiquidity,
  IncreasePosition,
  DecreasePosition,
  LiquidatePosition,
  ClosePosition,
  Transaction,
  Swap,
  StakeDmx,
  UnstakeDmx,
  StakeDlp,
  UnstakeDlp,
  CreateIncreasePosition,
  CreateDecreasePosition
} from "../generated/schema"

function _createTransactionIfNotExist(event: ethereum.Event): string {
  let id = event.transaction.hash.toHexString()
  let entity = Transaction.load(id)

  if (entity == null) {
    entity = new Transaction(id)
    entity.timestamp = event.block.timestamp.toI32()
    entity.blockNumber = event.block.number.toI32()
    entity.from = event.transaction.from.toHexString()
    entity.to = event.transaction.to.toHexString()
    entity.save()
  }

  return id
}

export function handleLiquidatePosition(event: vault.LiquidatePosition): void {
  let id = event.transaction.hash.toHexString()
  let entity = new LiquidatePosition(id)

  entity.key = event.params.key.toHexString()
  entity.account = event.params.account.toHexString()
  entity.collateralToken = event.params.collateralToken.toHexString()
  entity.indexToken = event.params.indexToken.toHexString()
  entity.isLong = event.params.isLong
  entity.size = event.params.size
  entity.collateral = event.params.collateral
  entity.reserveAmount = event.params.reserveAmount
  entity.realisedPnl = event.params.realisedPnl
  entity.markPrice = event.params.markPrice

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleClosePosition(event: vault.ClosePosition): void {
  let id = event.transaction.hash.toHexString()
  let entity = new ClosePosition(id)

  entity.key = event.params.key.toHexString()
  entity.size = event.params.size
  entity.collateral = event.params.collateral
  entity.averagePrice = event.params.averagePrice
  entity.entryFundingRate = event.params.entryFundingRate
  entity.reserveAmount = event.params.reserveAmount
  entity.realisedPnl = event.params.realisedPnl

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleCreateIncreasePosition(event: positionRouter.CreateIncreasePosition): void {
  let id = event.transaction.hash.toHexString()
  let entity = new CreateIncreasePosition(id)

  entity.account = event.params.account.toHexString()
  let path = event.params.path
  entity.collateralToken = path[path.length - 1].toHexString()
  entity.indexToken = event.params.indexToken.toHexString()
  entity.sizeDelta = event.params.sizeDelta
  entity.amountIn = event.params.amountIn
  entity.isLong = event.params.isLong
  entity.acceptablePrice = event.params.acceptablePrice
  entity.executionFee = event.params.executionFee

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleCreateDecreasePosition(event: positionRouter.CreateDecreasePosition): void {
  let id = event.transaction.hash.toHexString()
  let entity = new CreateDecreasePosition(id)

  entity.account = event.params.account.toHexString()
  let path = event.params.path
  entity.collateralToken = path[0].toHexString()
  entity.indexToken = event.params.indexToken.toHexString()
  entity.sizeDelta = event.params.sizeDelta
  entity.isLong = event.params.isLong
  entity.acceptablePrice = event.params.acceptablePrice
  entity.executionFee = event.params.executionFee

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleIncreasePosition(event: vault.IncreasePosition): void {
  let id = event.transaction.hash.toHexString()
  let entity = new IncreasePosition(id)

  entity.key = event.params.key.toHexString()
  entity.account = event.params.account.toHexString()
  entity.collateralToken = event.params.collateralToken.toHexString()
  entity.indexToken = event.params.indexToken.toHexString()
  entity.collateralDelta = event.params.collateralDelta
  entity.sizeDelta = event.params.sizeDelta
  entity.isLong = event.params.isLong
  entity.price = event.params.price
  entity.fee = event.params.fee

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleDecreasePosition(event: vault.DecreasePosition): void {
  let id = event.transaction.hash.toHexString()
  let entity = new DecreasePosition(id)

  entity.key = event.params.key.toHexString()
  entity.account = event.params.account.toHexString()
  entity.collateralToken = event.params.collateralToken.toHexString()
  entity.indexToken = event.params.indexToken.toHexString()
  entity.collateralDelta = event.params.collateralDelta
  entity.sizeDelta = event.params.sizeDelta
  entity.isLong = event.params.isLong
  entity.price = event.params.price
  entity.fee = event.params.fee

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleCollectMarginFees(event: vault.CollectMarginFees): void {
  let entity = new CollectMarginFee(event.transaction.hash.toHexString())

  entity.token = event.params.token
  entity.feeTokens = event.params.feeTokens
  entity.feeUsd = event.params.feeUsd

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleCollectSwapFees(event: vault.CollectSwapFees): void {
  let entity = new CollectSwapFee(event.transaction.hash.toHexString())

  entity.token = event.params.token
  entity.feeTokens = event.params.feeUsd
  entity.feeUsd = event.params.feeTokens

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()
  
  entity.save()
}

export function handleSwap(event: vault.Swap): void {
  let entity = new Swap(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.tokenIn = event.params.tokenIn.toHexString()
  entity.tokenOut = event.params.tokenOut.toHexString()
  entity.amountIn = event.params.amountIn
  entity.amountOut = event.params.amountOut
  entity.amountOutAfterFees = event.params.amountOutAfterFees
  entity.feeBasisPoints = event.params.feeBasisPoints

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleAddLiquidity(event: dlpManager.AddLiquidity): void {
  let entity = new AddLiquidity(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.token = event.params.token.toHexString()
  entity.amount = event.params.amount
  entity.aumInUsdg = event.params.aumInUsdg
  entity.dlpSupply = event.params.dlpSupply
  entity.usdgAmount = event.params.usdgAmount
  entity.mintAmount = event.params.mintAmount

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleRemoveLiquidity(event: dlpManager.RemoveLiquidity): void {
  let entity = new RemoveLiquidity(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.token = event.params.token.toHexString()
  entity.dlpAmount = event.params.dlpAmount
  entity.aumInUsdg = event.params.aumInUsdg
  entity.dlpSupply = event.params.dlpSupply
  entity.usdgAmount = event.params.usdgAmount
  entity.amountOut = event.params.amountOut

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save() 
}

export function handleStakeDmx(event: rewardRouter.StakeDmx): void {
  let entity = new StakeDmx(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.token = event.params.token.toHexString()
  entity.amount = event.params.amount

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleUnstakeDmx(event: rewardRouter.UnstakeDmx): void {
  let entity = new UnstakeDmx(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.token = event.params.token.toHexString()
  entity.amount = event.params.amount

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleStakeDlp(event: rewardRouter.StakeDlp): void {
  let entity = new StakeDlp(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.amount = event.params.amount

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleUnstakeDlp(event: rewardRouter.UnstakeDlp): void {
  let entity = new UnstakeDlp(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.amount = event.params.amount

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}
