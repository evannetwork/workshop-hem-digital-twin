exports['default'] = {
  ethAccounts: {
    '0xE4D622919fF8B3B628CBecE2EA9E819079678876': 'bab571d000291e8d0d8ea5a1961193cd373c1ca8379a8751e1c4e79027faa2df'
  },
  encryptionKeys: {
    '0xc5f136c0179a99e4297923680da7b5c5b80a21443beced065d74de082681e7be': '07607e8cd5cafa83e6521d66854d26c64177df010d5d200853c9b20e41ffde8e',
    '0xaaf63f2adae969cdf44f5c2100fda045a98d369fae7378cdd0f18d70fde985c9': '07607e8cd5cafa83e6521d66854d26c64177df010d5d200853c9b20e41ffde8e'
  },
  smartAgentWorkshopHem: (api) => {
    return {
      disabled: false,
      name: 'workshop-hem',
      ethAccount: '0xE4D622919fF8B3B628CBecE2EA9E819079678876',
      ensAddress: 'hem-swo-19-10-01.fifs.registrar.test.evan',
      iotDevice: '0x1F2800184237f18bbc7c7EAeb3dd9Ccd1744F40d'
    }
  }
}
