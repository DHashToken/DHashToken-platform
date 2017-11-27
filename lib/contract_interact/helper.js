"use strict";

const rootPrefix = '../..'
  , assert = require("assert")
  , coreAddresses = require(rootPrefix+'/config/core_addresses')
  , web3EventsDecoder = require(rootPrefix+'/lib/web3/events/decoder')
  ;

const helper = {

  call: function (web3RpcProvider, currContractAddr, encodeABI, options, transactionOutputs) {
    var params = {
      to: currContractAddr,
      data: encodeABI
    };
    if (options) {
      Object.assign(params,options)
    }
    return web3RpcProvider.eth.call(params)
      .then(response => {
        if ( transactionOutputs ) {
          return web3RpcProvider.eth.abi.decodeParameters(transactionOutputs, response);  
        } else {
          return response;
        }
      });
  },

  //transactionObject is returned from call method.
  getTransactionOutputs: function ( transactionObject ) {
    return transactionObject._method.outputs;
  },

  send: function (web3RpcProvider, currContractAddr, encodeABI, options, transactionOutputs) {
    var params = {
      to: currContractAddr,
      data: encodeABI
    };
    if (options) {
      Object.assign(params, options)
    }
    
    return web3RpcProvider.eth.sendTransaction(params)
      .then(response => {
        if ( transactionOutputs ) {
          return web3RpcProvider.eth.abi.decodeParameters(transactionOutputs, response);  
        } else {
          return response;
        }
      });
    
  },

  sendTxAsync: function (web3RpcProvider, currContractAddr, encodeABI, senderName, txOptions) {
    const senderAddr = coreAddresses.getAddressForUser(senderName)
          ,senderPassphrase = coreAddresses.getPassphraseForUser(senderName)
    ;

    return helper.sendTxAsyncFromAddr(web3RpcProvider, currContractAddr, encodeABI, senderAddr, senderPassphrase, txOptions);
  },

  sendTxAsyncFromAddr: function (web3RpcProvider, currContractAddr, encodeABI, senderAddr, senderPassphrase, txOptions) { 
    return new Promise(async function (onResolve, onReject) {

      const txParams = {
        from: senderAddr,
        to: currContractAddr,
        data: encodeABI
      };
      Object.assign(txParams, txOptions);

      console.log("sendTxAsyncFromAddr :: Unlock Account", senderAddr);
      web3RpcProvider.eth.personal.unlockAccount( senderAddr, senderPassphrase)
        .then( _ => {
          console.log("sendTxAsyncFromAddr :: Unlocked" ,senderAddr );
          web3RpcProvider.eth.sendTransaction(txParams)
            .on('transactionHash', onResolve)
            .on('error', onReject)
          ;
        })
        .catch( reason => {
          onReject( reason );
        })
      ;

    });
  },

  safeSend: function (web3RpcProvider, currContractAddr, encodeABI, senderName, txOptions) {
    return helper.sendTxAsync(web3RpcProvider, currContractAddr, encodeABI, senderName, txOptions).then(
      function(transactionHash){
        return helper.getTxReceipt(web3RpcProvider, transactionHash);
      }
    );
  },

  safeSendFromAddr: function (web3RpcProvider, currContractAddr, encodeABI, senderAddr, senderPassphrase, txOptions) {
    return helper.sendTxAsyncFromAddr(web3RpcProvider, currContractAddr, encodeABI, senderAddr, senderPassphrase, txOptions).then(
      function(transactionHash){
        return helper.getTxReceipt(web3RpcProvider, transactionHash);
      }
    );
  },

  getTxReceipt: function(web3RpcProvider, transactionHash) {
    return new Promise (function(onResolve, onReject) {

      var tryReceipt = function() {
        setTimeout( function(){
            web3RpcProvider.eth.getTransactionReceipt(transactionHash).then(handleResponse);
          },
          5000
        );
      };

      var handleResponse = function (response) {
        if (response) {
          //clearInterval(txSetInterval);
          const web3EventsDecoderResult = web3EventsDecoder.perform(response);
          onResolve(web3EventsDecoderResult);
        } else {
          console.log('Waiting for ' + transactionHash + ' to be mined');
          tryReceipt();
        }
      };

      tryReceipt();

    });
  },

  toAddress: function (web3RpcProvider, result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.eth.abi.decodeParameter('address', result));
    });
  },

  toString: function (web3RpcProvider, result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.eth.abi.decodeParameter('bytes32', result));
    });
  },

  toNumber: function (web3RpcProvider, result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.utils.hexToNumber(result));
    });
  },

  decodeUint256: function (web3RpcProvider, result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.eth.abi.decodeParameter('uint256', result));
    });
  },

  assertAddress: function ( address ) {
    assert.ok(/^0x[0-9a-fA-F]{40}$/.test(address), `Invalid blockchain address: ${address}`);
  },

  isAddressValid: function ( address ) {
    if ( typeof address !== "string" ) {
      return false;
    }
    return /^0x[0-9a-fA-F]{40}$/.test(address);
  }

};

module.exports = helper;