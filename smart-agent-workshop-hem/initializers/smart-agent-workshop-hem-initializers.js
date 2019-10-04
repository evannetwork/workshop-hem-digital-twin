'use strict'

const abiDecoder = require('abi-decoder')
const { DigitalTwin } = require('@evan.network/api-blockchain-core')
const {
  api,
  Initializer
} = require('actionhero')

module.exports = class SmartAgentWorkshopHemInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'workshop-hem'
    this.loadPriority = 4100
    this.startPriority = 4100
    this.stopPriority = 4100
  }

  async initialize () {
    if (api.config.smartAgentWorkshopHem.disabled) {
      return
    }

    // specialize from blockchain smart agent library
    class SmartAgentWorkshopHem extends api.smartAgents.SmartAgent {
      async createTwin() {
        const description = {
          name: 'Bliss Fox FI 500',
          description: 'Digital Twin for my Bliss Fox FI 500',
          author: 'Sebastian Wolfram',
          version: '0.1.0',
          dbcpVersion: 2
        }
        const digitalTwin = await DigitalTwin.create(
          this.runtime, { accountId: this.config.ethAccount, description })
        const twinAddress = await digitalTwin.getContractAddress()

        // store twin address in ens
        await this.runtime.nameResolver.setAddress(
          this.config.ensAddress, twinAddress, this.config.ethAccount)

        return twinAddress
      }

      async getTwinContainerEntry(containerName, entryName) {
        const digitalTwin = this._getDigitalTwin()
        const container = await digitalTwin.getEntry(containerName)
        return container.value.getEntry(entryName)
      }

      async initialize () {
        await super.initialize()
        this._listenToTransactions()
      }

      async updateTwin() {
        const digitalTwin = this._getDigitalTwin();

        let containers = await digitalTwin.getEntries()

        if (!containers.metadata) {
          // first update
          const newContainers = await digitalTwin.createContainers({
            metadata: {}
          })

          await newContainers.metadata.setEntry('power', '56,0t')
          await newContainers.metadata.setEntry('length', '9,4m')

          containers = await digitalTwin.getEntries()

          // second update
          await containers.metadata.value.shareProperties([{
            accountId: this.config.iotDevice,
            read: ['length'],
          }])

          // third update
          await containers.metadata.value.addListEntries(
            'usagelog',
            [ { state: 'initial', timestamp: Date.now() } ]
          )
          await containers.metadata.value.shareProperties([{
            accountId: this.config.iotDevice,
            readWrite: ['usagelog'],
          }])
        }

        // fourth update
        await containers.metadata.value.setEntry('workingtime', 0)
        await containers.metadata.value.shareProperties([{
          accountId: this.config.iotDevice,
          read: ['workingtime'],
        }])
      }

      _getDigitalTwin() {
        return new DigitalTwin(
          this.runtime,
          {
            accountId: this.config.ethAccount,
            address: this.config.ensAddress
          }
        )
      }

      async _listenToTransactions() {
        api.log('subscribing to digital twin updates', 'debug')
        abiDecoder.addABI(JSON.parse(this.runtime.contractLoader.contracts.DataContract.interface))

        const digitalTwin = this._getDigitalTwin()
        const container = (await digitalTwin.getEntry('metadata')).value
        const containerAddress = await container.getContractAddress()

        api.eth.blockEmitter.on('data', async (block) => {
          for (let transaction of block.transactions) {
            if (containerAddress === transaction.to) {
              const input = abiDecoder.decodeMethod(transaction.input)
              if (input &&
                  input.params[0].value[0] === this.runtime.nameResolver.soliditySha3('usagelog')) {
                api.log('received an update to "usagelog"')
                // get entries from list 'usagelog', fetch 2 items, skip no items, last items first
                const entries = await container.getListEntries('usagelog', 2, 0, true)
                if (entries.length === 2 &&
                    entries[0].state === 'stopped' &&
                    entries[1].state === 'started') {
                  let workingtime = await container.getEntry('workingtime')
                  workingtime += entries[0].timestamp - entries[1].timestamp
                  await container.setEntry('workingtime', workingtime)
                } else {
                  api.log('received "usagelog" update, but last entries were invalid')
                }
              }
            }
          }
        })
      }
    }

    // start the initialization code
    const smartAgentWorkshopHem = new SmartAgentWorkshopHem(api.config.smartAgentWorkshopHem)
    await smartAgentWorkshopHem.initialize()

    // objects and values used outside initializer
    api.smartAgentWorkshopHem = smartAgentWorkshopHem
  }
}
