'use strict'
const { Action, api } = require('actionhero')

const rxEtherAccount = /^0x[\da-fA-F]{40}/

class SmartAgentWorkshopHem extends Action {
  constructor () {
    super()
    this.name = 'smart-agents/workshop-hem/status/get'
    this.description = 'Workshop-hem status action.'
    this.inputs = {
      accountId: {
        required: true,
        validator: this.accountValidator
      }
    }
    this.outputExample = { }
    // this.middleware = ['ensureEvanAuth']
  }

  accountValidator (param) {
    if (!param.match(rxEtherAccount)) {
      throw new Error('not a valid account address')
    }
  }

  async run ({ params, response }) {
    try {
      // if required, authenticated user / accountId can be retrieved from connection
      // this requires the "ensureEvanAuth" middleware to be enabled (see above)
      // const accountId = connection.evanAuth.EvanAuth

      response.result = `successful status call from accountId: ${params.accountId}`
      response.status = 'success'
    } catch (ex) {
      api.log(ex)
      response.status = 'error'
      response.error = ex
    }
  }
}

class SmartAgentWorkshopHemTwinContainerEntryGet extends Action {
  constructor () {
    super()
    this.name = 'smart-agents/workshop-hem/twin/container/entry/get'
    this.description = 'returns a new Digital Twin containers entry value'
    this.inputs = {
      container: { required: true },
      entry: { required: true }
    }
    this.outputExample = { }
  }

  async run ({ params, response }) {
    try {
      response.result = await api.smartAgentWorkshopHem.getTwinContainerEntry(params.container, params.entry) 
      response.status = 'success'
    } catch (ex) {
      api.log(ex)
      response.status = 'error'
      response.error = ex
    }
  }
}

class SmartAgentWorkshopHemTwinCreate extends Action {
  constructor () {
    super()
    this.name = 'smart-agents/workshop-hem/twin/create'
    this.description = 'creates a new Digital Twin'
    this.inputs = { }
    this.outputExample = { }
  }

  async run ({ params, response }) {
    try {
      response.result = await api.smartAgentWorkshopHem.createTwin()
      response.status = 'success'
    } catch (ex) {
      api.log(ex)
      response.status = 'error'
      response.error = ex
    }
  }
}

class SmartAgentWorkshopHemTwinUpdate extends Action {
  constructor () {
    super()
    this.name = 'smart-agents/workshop-hem/twin/update'
    this.description = 'creates a new Digital Twin'
    this.inputs = { }
    this.outputExample = { }
  }

  async run ({ params, response }) {
    try {
      await api.smartAgentWorkshopHem.updateTwin()
      response.status = 'success'
    } catch (ex) {
      api.log(ex)
      response.status = 'error'
      response.error = ex
    }
  }
}

module.exports = {
  SmartAgentWorkshopHem,
  SmartAgentWorkshopHemTwinContainerEntryGet,
  SmartAgentWorkshopHemTwinCreate,
  SmartAgentWorkshopHemTwinUpdate
}
