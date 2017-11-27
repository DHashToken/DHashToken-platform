"use strict";

/*
 * Load all contract bin files
 *
 */

const fs = require('fs');

const coreBins = {
  simpleToken: fs.readFileSync('./contracts/bin/SimpleToken.bin', 'utf8'),
  DHashTokenUtility: fs.readFileSync('./contracts/bin/DHashTokenUtility.bin', 'utf8'),
  DHashTokenValue: fs.readFileSync('./contracts/bin/DHashTokenValue.bin', 'utf8'),
  stPrime: fs.readFileSync('./contracts/bin/STPrime.bin', 'utf8'),
  valueCore: fs.readFileSync('./contracts/bin/Core.bin', 'utf8'),
  valueRegistrar: fs.readFileSync('./contracts/bin/Registrar.bin', 'utf8'),
  utilityRegistrar: fs.readFileSync('./contracts/bin/Registrar.bin', 'utf8'),
  staking: '',
  brandedToken:  fs.readFileSync('./contracts/bin/BrandedToken.bin', 'utf8')
};

module.exports = coreBins;
