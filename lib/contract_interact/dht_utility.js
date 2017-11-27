"use strict";

const web3RpcProvider = require('../web3/providers/utility_rpc')
  , helper = require('./helper')
  , contractName = 'DHashTokenUtility'
  , coreAddresses = require('../../config/core_addresses')
  , contractAbi = coreAddresses.getAbiForContract(contractName)
  , currContract = new web3RpcProvider.eth.Contract( contractAbi )
  , responseHelper = require('../../lib/formatter/response')
  ;

//currContract.setProvider( web3RpcProvider.currentProvider );

const DHashTokenUtilityContractInteract = module.exports = function (contractAddress) {
  this.contractAddress = contractAddress;
};

DHashTokenUtilityContractInteract.prototype = {

  getSimpleTokenPrimeContractAddress: async function(){
    const encodedABI = currContract.methods.simpleTokenPrime.encodeABI();
    const response = await helper.call(web3RpcProvider, this.contractAddress, encodeABI);
    return Promise.resolve(responseHelper.successWithData({simpleTokenPrimeContractAddress: response}));
  },

  getSimpleTokenPrimeUUID: async function(){
    const encodedABI = currContract.methods.uuidSTPrime.encodeABI();
    const response = await helper.call(web3RpcProvider, this.contractAddress, encodeABI);
    return Promise.resolve(responseHelper.successWithData({simpleTokenPrimeUUID: response}));
  },

  processMinting: async function(reserveAddress, reservePassphrase, stakingIntentHash){

    const encodedABI = currContract.methods.processMinting(stakingIntentHash).encodeABI();

    const transactionReceipt = await helper.safeSendFromAddr(
      web3RpcProvider,
      currContractAddr,
      encodedABI,
      reserveAddress,
      reservePassphrase,
      { gasPrice: coreConstants.OST_DEFAULT_GAS_PRICE }
    );

    //return => tokenAddress;
    return Promise.resolve(transactionReceipt);

  }


};