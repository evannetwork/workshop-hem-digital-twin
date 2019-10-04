exports['default'] = {
  ethAccounts: {
    'ACCOUNTID': 'PRIVATE_KEY'
  },
  encryptionKeys: {
    'CUSTOM_HASH': 'ENCRYPTION_KEY',
    'CUSTOM_HASH': 'ENCRYPTION_KEY'
  },
  smartAgentWorkshopHem: (api) => {
    return {
      disabled: false,
      name: 'workshop-hem',
      ethAccount: 'ACCOUNTID',
      ensAddress: 'ENS_ADDRESS',
      iotDevice: '2ND_ACCOUNTID'
    }
  }
}
