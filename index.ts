import { ethers, BigNumber } from 'ethers';
import { ETH, USDC, WETH } from './tokens';

import { EthereumConstants } from './chains';

import * as fs from 'fs';

const fetch = require('node-fetch');

const FROM_TOKEN = USDC;
const FROM_BALANCE = BigNumber.from('1000000');
const TO_TOKEN = WETH;

(async () => {
  console.info(`Converting ${FROM_BALANCE.toString()} ${FROM_TOKEN.symbol} to ${TO_TOKEN.symbol}`);

  // Get the contract for a DEX.
  const uniswapAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const jsonData = fs.readFileSync('abi.json', 'utf-8');
  const uniswapABI = JSON.parse(jsonData).abi;
  const provider = ethers.getDefaultProvider('homestead');
  const uniswapContract = new ethers.Contract(uniswapAddress, uniswapABI, provider);

  // Using contract to determine number of TO_TOKENS given balance and FROM_TOKEN
  let numOfToTokens = await uniswapContract.getAmountsOut(FROM_BALANCE,[FROM_TOKEN.address, TO_TOKEN.address]);

  const decimalPoints = 10**(TO_TOKEN.decimals - FROM_TOKEN.decimals);

  const swapBalance = parseFloat(BigNumber.from(numOfToTokens[1]).div(decimalPoints).toString() + "." + BigNumber.from(numOfToTokens[1]).mod(decimalPoints).toString());
  console.info(`Estimated swap balance: ${swapBalance.toFixed(2)} ${TO_TOKEN.symbol}`);

  // Using coingecko API to get spot values of both from and to token
  const coingeckoResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${FROM_TOKEN.coingecko}%2c${TO_TOKEN.coingecko}&vs_currencies=usd&precision=18`);
  const listOfSpotValues = await coingeckoResponse.json();

  const fromTokenSpotValue = listOfSpotValues[FROM_TOKEN.coingecko].usd;
  const toTokenSpotValue = listOfSpotValues[TO_TOKEN.coingecko].usd;

  // Computing slippage on the swap
  let preSwapValue = parseFloat(fromTokenSpotValue) * parseFloat(FROM_BALANCE.toString());
  let postSwapValue = parseFloat(toTokenSpotValue) * swapBalance;

  const slippagePercent = ((Math.abs(postSwapValue - preSwapValue)) / preSwapValue)

  console.info(`Slippage: ${(slippagePercent * 100).toFixed(2)}%`);
})();
