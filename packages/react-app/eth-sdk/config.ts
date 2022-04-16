import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
   contracts: {
      rinkeby: {
         zoraTransferHelper: '0x029AA5a949C9C90916729D50537062cb73b5Ac92',
         zoraModuleManager: '0xa248736d3b73A231D95A5F99965857ebbBD42D85',
         zoraAsksV1_1Module: '0xA98D3729265C88c5b3f861a0c501622750fF4806',
         lostandFoundContract: '0x0E0e37De35471924F50598d55F7b69f93703fA01',
         lostandFoundContract2: '0x47686F3CE340bcb8609a5D65016d99B1299835e8',
      },
   },
})