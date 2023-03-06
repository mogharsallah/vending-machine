import { Coin, CoinsPayload } from './types'

export const smallestCoin: Coin = 5
export const coins: Coin[] = [100, 50, 20, 10, 5]

export const getSumByCoins = (coins: CoinsPayload) => {
  return coins.reduce((acc, coin) => acc + coin, 0)
}

export const getCoinsBySum = (sum: number) => {
  let coinsPayload: CoinsPayload = []
  if (sum < smallestCoin) {
    return coinsPayload
  }

  coins.reduce((acc, nextCoin) => {
    const coinCount = Math.floor(acc / nextCoin)

    if (coinCount === 0) {
      return acc
    }

    const rest = acc % nextCoin
    coinsPayload = coinsPayload.concat(Array.from(Array(coinCount).keys()).map((_) => nextCoin))

    return rest
  }, sum)

  return coinsPayload
}
