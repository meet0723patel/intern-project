import { ethers, BigNumber } from 'ethers';
import { ETH, USDC } from './tokens';
import Web3 from 'web3';
import * as fs from 'fs';

const FROM_TOKEN = USDC;
const FROM_BALANCE = BigNumber.from('1000000');
const TO_TOKEN = ETH;

(async () => {
  console.info(`Converting ${FROM_BALANCE.toString()} ${FROM_TOKEN.symbol} to ${TO_TOKEN.symbol}`);
  console.info('HELLO WORLD')

  // Get the contract for a DEX.
  
  const uniswapAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const jsonData = fs.readFileSync('abi.json', 'utf-8');
  const uniswapABI = JSON.parse(jsonData);


  // Use ethers and the DEX contract to figure out how much TO_TOKEN you can get
  // for the FROM_TOKEN.

  // TODO:
  const swapBalance = BigNumber.from('0');

  console.info(`Estimated swap balance: ${swapBalance.toString()} ${TO_TOKEN.symbol}`);

  // Figure out spot values of tokens.

  // Calculate slippage on the swap.

  // TODO:
  const slippagePercent = 0.01;

  console.info(`Slippage: ${slippagePercent * 100}%`);
})();
