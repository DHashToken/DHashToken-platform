#!/bin/sh

BINDIRVALUE=./contracts/bin
ABIDIRUTILITY=./contracts/abi

mkdir -p "$BINDIRVALUE"
mkdir -p "$ABIDIRUTILITY"

echo ""
echo "Compiling SimpleToken.sol"
echo ""

solc --abi --overwrite ../DHashToken-protocol/contracts/SimpleToken/SimpleToken.sol -o $ABIDIRUTILITY
solc --bin --overwrite ../DHashToken-protocol/contracts/SimpleToken/SimpleToken.sol -o $BINDIRVALUE

echo ""
echo "Compiling DHashTokenUtility.sol"
echo ""

solc --abi --overwrite ../DHashToken-protocol/contracts/DHashTokenUtility.sol -o $ABIDIRUTILITY
solc --bin --overwrite ../DHashToken-protocol/contracts/DHashTokenUtility.sol -o $BINDIRVALUE

echo ""
echo "Compiling DHashTokenValue.sol"
echo ""

solc --abi --overwrite ../DHashToken-protocol/contracts/DHashTokenValue.sol -o $ABIDIRUTILITY
solc --bin --overwrite ../DHashToken-protocol/contracts/DHashTokenValue.sol -o $BINDIRVALUE

echo ""
echo "Compiling Core.sol"
echo ""

solc --abi --overwrite ../DHashToken-protocol/contracts/Core.sol -o $ABIDIRUTILITY
solc --bin --overwrite ../DHashToken-protocol/contracts/Core.sol -o $BINDIRVALUE

echo ""
echo "Compiling Registrar.sol"
echo ""

solc --abi --overwrite ../DHashToken-protocol/contracts/Registrar.sol -o $ABIDIRUTILITY
solc --bin --overwrite ../DHashToken-protocol/contracts/Registrar.sol -o $BINDIRVALUE