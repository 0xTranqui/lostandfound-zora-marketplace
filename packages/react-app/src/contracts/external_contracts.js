//importing my own ABIs that I generated with eth-sdk

const LOSTANDFOUNDCONTRACT2ABI = [
  {
    inputs: [
        {
            internalType: "string",
            name: "customBaseURI_",
            type: "string",
        },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
},
{
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
        },
        {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
        },
        {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
    ],
    name: "Approval",
    type: "event",
},
{
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
        },
        {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
        },
        {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
        },
    ],
    name: "ApprovalForAll",
    type: "event",
},
{
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
        },
        {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
        },
    ],
    name: "OwnershipTransferred",
    type: "event",
},
{
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
        },
        {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
        },
        {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
    ],
    name: "Transfer",
    type: "event",
},
{
    inputs: [],
    name: "MAX_MULTIMINT",
    outputs: [
        {
            internalType: "uint256",
            name: "",
            type: "uint256",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [
        {
            internalType: "uint256",
            name: "",
            type: "uint256",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [],
    name: "MINT_LIMIT_PER_WALLET",
    outputs: [
        {
            internalType: "uint256",
            name: "",
            type: "uint256",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [],
    name: "PRICE",
    outputs: [
        {
            internalType: "uint256",
            name: "",
            type: "uint256",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [
        {
            internalType: "address",
            name: "minter",
            type: "address",
        },
    ],
    name: "allowedMintCount",
    outputs: [
        {
            internalType: "uint256",
            name: "",
            type: "uint256",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [
        {
            internalType: "address",
            name: "to",
            type: "address",
        },
        {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    inputs: [
        {
            internalType: "address",
            name: "owner",
            type: "address",
        },
    ],
    name: "balanceOf",
    outputs: [
        {
            internalType: "uint256",
            name: "",
            type: "uint256",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [],
    name: "contractURI",
    outputs: [
        {
            internalType: "string",
            name: "",
            type: "string",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [
        {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
    ],
    name: "getApproved",
    outputs: [
        {
            internalType: "address",
            name: "",
            type: "address",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [
        {
            internalType: "address",
            name: "owner",
            type: "address",
        },
        {
            internalType: "address",
            name: "operator",
            type: "address",
        },
    ],
    name: "isApprovedForAll",
    outputs: [
        {
            internalType: "bool",
            name: "",
            type: "bool",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [
        {
            internalType: "uint256",
            name: "count",
            type: "uint256",
        },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
},
{
    inputs: [],
    name: "name",
    outputs: [
        {
            internalType: "string",
            name: "",
            type: "string",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [],
    name: "owner",
    outputs: [
        {
            internalType: "address",
            name: "",
            type: "address",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [
        {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
    ],
    name: "ownerOf",
    outputs: [
        {
            internalType: "address",
            name: "",
            type: "address",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    inputs: [
        {
            internalType: "uint256",
            name: "",
            type: "uint256",
        },
        {
            internalType: "uint256",
            name: "salePrice",
            type: "uint256",
        },
    ],
    name: "royaltyInfo",
    outputs: [
        {
            internalType: "address",
            name: "receiver",
            type: "address",
        },
        {
            internalType: "uint256",
            name: "royaltyAmount",
            type: "uint256",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [
        {
            internalType: "address",
            name: "from",
            type: "address",
        },
        {
            internalType: "address",
            name: "to",
            type: "address",
        },
        {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    inputs: [
        {
            internalType: "address",
            name: "from",
            type: "address",
        },
        {
            internalType: "address",
            name: "to",
            type: "address",
        },
        {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
        {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
        },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    inputs: [
        {
            internalType: "address",
            name: "operator",
            type: "address",
        },
        {
            internalType: "bool",
            name: "approved",
            type: "bool",
        },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    inputs: [
        {
            internalType: "string",
            name: "customBaseURI_",
            type: "string",
        },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    inputs: [
        {
            internalType: "string",
            name: "customContractURI_",
            type: "string",
        },
    ],
    name: "setContractURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    inputs: [
        {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
        },
    ],
    name: "supportsInterface",
    outputs: [
        {
            internalType: "bool",
            name: "",
            type: "bool",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [],
    name: "symbol",
    outputs: [
        {
            internalType: "string",
            name: "",
            type: "string",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [
        {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
    ],
    name: "tokenURI",
    outputs: [
        {
            internalType: "string",
            name: "",
            type: "string",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [],
    name: "totalSupply",
    outputs: [
        {
            internalType: "uint256",
            name: "",
            type: "uint256",
        },
    ],
    stateMutability: "view",
    type: "function",
},
{
    inputs: [
        {
            internalType: "address",
            name: "from",
            type: "address",
        },
        {
            internalType: "address",
            name: "to",
            type: "address",
        },
        {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
        },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    inputs: [
        {
            internalType: "address",
            name: "newOwner",
            type: "address",
        },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    inputs: [
        {
            internalType: "contract IERC20",
            name: "token",
            type: "address",
        },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
},
{
    stateMutability: "payable",
    type: "receive",
},


]


const LOSTANDFOUNDCONTRACTABI = [
  {
      inputs: [
          {
              internalType: "string",
              name: "customBaseURI_",
              type: "string",
          },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
          },
          {
              indexed: true,
              internalType: "address",
              name: "approved",
              type: "address",
          },
          {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
      ],
      name: "Approval",
      type: "event",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
          },
          {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
          },
          {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
          },
      ],
      name: "ApprovalForAll",
      type: "event",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
          },
          {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
          },
      ],
      name: "OwnershipTransferred",
      type: "event",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
          },
          {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
          },
          {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
      ],
      name: "Transfer",
      type: "event",
  },
  {
      inputs: [],
      name: "MAX_MULTIMINT",
      outputs: [
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "MAX_SUPPLY",
      outputs: [
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "MINT_LIMIT_PER_WALLET",
      outputs: [
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "PRICE",
      outputs: [
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "minter",
              type: "address",
          },
      ],
      name: "allowedMintCount",
      outputs: [
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "to",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "owner",
              type: "address",
          },
      ],
      name: "balanceOf",
      outputs: [
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "contractURI",
      outputs: [
          {
              internalType: "string",
              name: "",
              type: "string",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
      ],
      name: "getApproved",
      outputs: [
          {
              internalType: "address",
              name: "",
              type: "address",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "owner",
              type: "address",
          },
          {
              internalType: "address",
              name: "operator",
              type: "address",
          },
      ],
      name: "isApprovedForAll",
      outputs: [
          {
              internalType: "bool",
              name: "",
              type: "bool",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "uint256",
              name: "count",
              type: "uint256",
          },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "payable",
      type: "function",
  },
  {
      inputs: [],
      name: "name",
      outputs: [
          {
              internalType: "string",
              name: "",
              type: "string",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "owner",
      outputs: [
          {
              internalType: "address",
              name: "",
              type: "address",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
      ],
      name: "ownerOf",
      outputs: [
          {
              internalType: "address",
              name: "",
              type: "address",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
          {
              internalType: "uint256",
              name: "salePrice",
              type: "uint256",
          },
      ],
      name: "royaltyInfo",
      outputs: [
          {
              internalType: "address",
              name: "receiver",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "royaltyAmount",
              type: "uint256",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "from",
              type: "address",
          },
          {
              internalType: "address",
              name: "to",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "from",
              type: "address",
          },
          {
              internalType: "address",
              name: "to",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
          {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
          },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "operator",
              type: "address",
          },
          {
              internalType: "bool",
              name: "approved",
              type: "bool",
          },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "string",
              name: "customBaseURI_",
              type: "string",
          },
      ],
      name: "setBaseURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "string",
              name: "customContractURI_",
              type: "string",
          },
      ],
      name: "setContractURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
          },
      ],
      name: "supportsInterface",
      outputs: [
          {
              internalType: "bool",
              name: "",
              type: "bool",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "symbol",
      outputs: [
          {
              internalType: "string",
              name: "",
              type: "string",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
      ],
      name: "tokenURI",
      outputs: [
          {
              internalType: "string",
              name: "",
              type: "string",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "totalSupply",
      outputs: [
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "from",
              type: "address",
          },
          {
              internalType: "address",
              name: "to",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "newOwner",
              type: "address",
          },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
];

const ZORAASKSV1_1MODULEABI = [
  {
      inputs: [
          {
              internalType: "address",
              name: "_erc20TransferHelper",
              type: "address",
          },
          {
              internalType: "address",
              name: "_erc721TransferHelper",
              type: "address",
          },
          {
              internalType: "address",
              name: "_royaltyEngine",
              type: "address",
          },
          {
              internalType: "address",
              name: "_protocolFeeSettings",
              type: "address",
          },
          {
              internalType: "address",
              name: "_wethAddress",
              type: "address",
          },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "tokenContract",
              type: "address",
          },
          {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
          {
              components: [
                  {
                      internalType: "address",
                      name: "seller",
                      type: "address",
                  },
                  {
                      internalType: "address",
                      name: "sellerFundsRecipient",
                      type: "address",
                  },
                  {
                      internalType: "address",
                      name: "askCurrency",
                      type: "address",
                  },
                  {
                      internalType: "uint16",
                      name: "findersFeeBps",
                      type: "uint16",
                  },
                  {
                      internalType: "uint256",
                      name: "askPrice",
                      type: "uint256",
                  },
              ],
              indexed: false,
              internalType: "struct AsksV1_1.Ask",
              name: "ask",
              type: "tuple",
          },
      ],
      name: "AskCanceled",
      type: "event",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "tokenContract",
              type: "address",
          },
          {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
          {
              components: [
                  {
                      internalType: "address",
                      name: "seller",
                      type: "address",
                  },
                  {
                      internalType: "address",
                      name: "sellerFundsRecipient",
                      type: "address",
                  },
                  {
                      internalType: "address",
                      name: "askCurrency",
                      type: "address",
                  },
                  {
                      internalType: "uint16",
                      name: "findersFeeBps",
                      type: "uint16",
                  },
                  {
                      internalType: "uint256",
                      name: "askPrice",
                      type: "uint256",
                  },
              ],
              indexed: false,
              internalType: "struct AsksV1_1.Ask",
              name: "ask",
              type: "tuple",
          },
      ],
      name: "AskCreated",
      type: "event",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "tokenContract",
              type: "address",
          },
          {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
          {
              indexed: true,
              internalType: "address",
              name: "buyer",
              type: "address",
          },
          {
              indexed: false,
              internalType: "address",
              name: "finder",
              type: "address",
          },
          {
              components: [
                  {
                      internalType: "address",
                      name: "seller",
                      type: "address",
                  },
                  {
                      internalType: "address",
                      name: "sellerFundsRecipient",
                      type: "address",
                  },
                  {
                      internalType: "address",
                      name: "askCurrency",
                      type: "address",
                  },
                  {
                      internalType: "uint16",
                      name: "findersFeeBps",
                      type: "uint16",
                  },
                  {
                      internalType: "uint256",
                      name: "askPrice",
                      type: "uint256",
                  },
              ],
              indexed: false,
              internalType: "struct AsksV1_1.Ask",
              name: "ask",
              type: "tuple",
          },
      ],
      name: "AskFilled",
      type: "event",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "tokenContract",
              type: "address",
          },
          {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
          {
              components: [
                  {
                      internalType: "address",
                      name: "seller",
                      type: "address",
                  },
                  {
                      internalType: "address",
                      name: "sellerFundsRecipient",
                      type: "address",
                  },
                  {
                      internalType: "address",
                      name: "askCurrency",
                      type: "address",
                  },
                  {
                      internalType: "uint16",
                      name: "findersFeeBps",
                      type: "uint16",
                  },
                  {
                      internalType: "uint256",
                      name: "askPrice",
                      type: "uint256",
                  },
              ],
              indexed: false,
              internalType: "struct AsksV1_1.Ask",
              name: "ask",
              type: "tuple",
          },
      ],
      name: "AskPriceUpdated",
      type: "event",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "userA",
              type: "address",
          },
          {
              indexed: true,
              internalType: "address",
              name: "userB",
              type: "address",
          },
          {
              components: [
                  {
                      internalType: "address",
                      name: "tokenContract",
                      type: "address",
                  },
                  {
                      internalType: "uint256",
                      name: "tokenId",
                      type: "uint256",
                  },
                  {
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                  },
              ],
              indexed: false,
              internalType: "struct UniversalExchangeEventV1.ExchangeDetails",
              name: "a",
              type: "tuple",
          },
          {
              components: [
                  {
                      internalType: "address",
                      name: "tokenContract",
                      type: "address",
                  },
                  {
                      internalType: "uint256",
                      name: "tokenId",
                      type: "uint256",
                  },
                  {
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                  },
              ],
              indexed: false,
              internalType: "struct UniversalExchangeEventV1.ExchangeDetails",
              name: "b",
              type: "tuple",
          },
      ],
      name: "ExchangeExecuted",
      type: "event",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "tokenContract",
              type: "address",
          },
          {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
          },
          {
              indexed: true,
              internalType: "address",
              name: "recipient",
              type: "address",
          },
          {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
          },
      ],
      name: "RoyaltyPayout",
      type: "event",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_tokenContract",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
          },
          {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
          },
          {
              internalType: "address",
              name: "_payoutCurrency",
              type: "address",
          },
      ],
      name: "_handleRoyaltyEnginePayout",
      outputs: [
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
      ],
      stateMutability: "payable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
      ],
      name: "askForNFT",
      outputs: [
          {
              internalType: "address",
              name: "seller",
              type: "address",
          },
          {
              internalType: "address",
              name: "sellerFundsRecipient",
              type: "address",
          },
          {
              internalType: "address",
              name: "askCurrency",
              type: "address",
          },
          {
              internalType: "uint16",
              name: "findersFeeBps",
              type: "uint16",
          },
          {
              internalType: "uint256",
              name: "askPrice",
              type: "uint256",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_tokenContract",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
          },
      ],
      name: "cancelAsk",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_tokenContract",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
          },
          {
              internalType: "uint256",
              name: "_askPrice",
              type: "uint256",
          },
          {
              internalType: "address",
              name: "_askCurrency",
              type: "address",
          },
          {
              internalType: "address",
              name: "_sellerFundsRecipient",
              type: "address",
          },
          {
              internalType: "uint16",
              name: "_findersFeeBps",
              type: "uint16",
          },
      ],
      name: "createAsk",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [],
      name: "erc20TransferHelper",
      outputs: [
          {
              internalType: "contract ERC20TransferHelper",
              name: "",
              type: "address",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "erc721TransferHelper",
      outputs: [
          {
              internalType: "contract ERC721TransferHelper",
              name: "",
              type: "address",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_tokenContract",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
          },
          {
              internalType: "address",
              name: "_fillCurrency",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "_fillAmount",
              type: "uint256",
          },
          {
              internalType: "address",
              name: "_finder",
              type: "address",
          },
      ],
      name: "fillAsk",
      outputs: [],
      stateMutability: "payable",
      type: "function",
  },
  {
      inputs: [],
      name: "name",
      outputs: [
          {
              internalType: "string",
              name: "",
              type: "string",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "registrar",
      outputs: [
          {
              internalType: "address",
              name: "",
              type: "address",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_tokenContract",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
          },
          {
              internalType: "uint256",
              name: "_askPrice",
              type: "uint256",
          },
          {
              internalType: "address",
              name: "_askCurrency",
              type: "address",
          },
      ],
      name: "setAskPrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_royaltyEngine",
              type: "address",
          },
      ],
      name: "setRoyaltyEngineAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
];

const ZORAMODULEMANAGERABI = [
  {
      inputs: [
          {
              internalType: "address",
              name: "_registrar",
              type: "address",
          },
          {
              internalType: "address",
              name: "_feeToken",
              type: "address",
          },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
          },
          {
              indexed: true,
              internalType: "address",
              name: "module",
              type: "address",
          },
          {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
          },
      ],
      name: "ModuleApprovalSet",
      type: "event",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "module",
              type: "address",
          },
      ],
      name: "ModuleRegistered",
      type: "event",
  },
  {
      anonymous: false,
      inputs: [
          {
              indexed: true,
              internalType: "address",
              name: "newRegistrar",
              type: "address",
          },
      ],
      name: "RegistrarChanged",
      type: "event",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_user",
              type: "address",
          },
          {
              internalType: "address",
              name: "_module",
              type: "address",
          },
      ],
      name: "isModuleApproved",
      outputs: [
          {
              internalType: "bool",
              name: "",
              type: "bool",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [],
      name: "moduleFeeToken",
      outputs: [
          {
              internalType: "contract ZoraProtocolFeeSettings",
              name: "",
              type: "address",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "",
              type: "address",
          },
      ],
      name: "moduleRegistered",
      outputs: [
          {
              internalType: "bool",
              name: "",
              type: "bool",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_module",
              type: "address",
          },
      ],
      name: "registerModule",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [],
      name: "registrar",
      outputs: [
          {
              internalType: "address",
              name: "",
              type: "address",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_module",
              type: "address",
          },
          {
              internalType: "bool",
              name: "_approved",
              type: "bool",
          },
      ],
      name: "setApprovalForModule",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_module",
              type: "address",
          },
          {
              internalType: "address",
              name: "_user",
              type: "address",
          },
          {
              internalType: "bool",
              name: "_approved",
              type: "bool",
          },
          {
              internalType: "uint256",
              name: "_deadline",
              type: "uint256",
          },
          {
              internalType: "uint8",
              name: "v",
              type: "uint8",
          },
          {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
          },
          {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
          },
      ],
      name: "setApprovalForModuleBySig",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address[]",
              name: "_modules",
              type: "address[]",
          },
          {
              internalType: "bool",
              name: "_approved",
              type: "bool",
          },
      ],
      name: "setBatchApprovalForModules",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_registrar",
              type: "address",
          },
      ],
      name: "setRegistrar",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "",
              type: "address",
          },
      ],
      name: "sigNonces",
      outputs: [
          {
              internalType: "uint256",
              name: "",
              type: "uint256",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "",
              type: "address",
          },
          {
              internalType: "address",
              name: "",
              type: "address",
          },
      ],
      name: "userApprovals",
      outputs: [
          {
              internalType: "bool",
              name: "",
              type: "bool",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
];

const ZORATRANSFERHELPERABI = [
  {
      inputs: [
          {
              internalType: "address",
              name: "_approvalsManager",
              type: "address",
          },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
  },
  {
      inputs: [],
      name: "ZMM",
      outputs: [
          {
              internalType: "contract ZoraModuleManager",
              name: "",
              type: "address",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_user",
              type: "address",
          },
      ],
      name: "isModuleApproved",
      outputs: [
          {
              internalType: "bool",
              name: "",
              type: "bool",
          },
      ],
      stateMutability: "view",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_token",
              type: "address",
          },
          {
              internalType: "address",
              name: "_from",
              type: "address",
          },
          {
              internalType: "address",
              name: "_to",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
          },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
  {
      inputs: [
          {
              internalType: "address",
              name: "_token",
              type: "address",
          },
          {
              internalType: "address",
              name: "_from",
              type: "address",
          },
          {
              internalType: "address",
              name: "_to",
              type: "address",
          },
          {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
          },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
  },
];

const ERC20ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];
const DAIABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId_",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "guy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: true,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "sig",
        type: "bytes4",
      },
      {
        indexed: true,
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "arg1",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "arg2",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "LogNote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "guy",
        type: "address",
      },
    ],
    name: "deny",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "move",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "holder",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "allowed",
        type: "bool",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "pull",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "push",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "guy",
        type: "address",
      },
    ],
    name: "rely",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "wards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

// Mainnet DAI, Optimism and Arbitrium Rollup Contracts with local addresses
module.exports = {
  1: {
    contracts: {
      DAI: {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        abi: DAIABI,
      },
      UNI: {
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        abi: ERC20ABI,
      },
    },
  },
  4: {
    contracts: {
      zoraTransferHelper: {
        address: "0x029AA5a949C9C90916729D50537062cb73b5Ac92",
        abi: ZORATRANSFERHELPERABI,
      },
      zoraModuleManager: {
        address: "0xa248736d3b73A231D95A5F99965857ebbBD42D85",
        abi: ZORAMODULEMANAGERABI,
      },
      zoraAsksV1_1Module: {
        address: "0xA98D3729265C88c5b3f861a0c501622750fF4806",
        abi: ZORAASKSV1_1MODULEABI,
      },
      lostandFoundContract: {
        address: "0xcdEC1f89eE5755C3b519A2F66851711da84BF876",
        abi: LOSTANDFOUNDCONTRACTABI,
      },
      lostandFoundContract2: {
        address: "0x7b2DE8719120F21Ac8A95f9115bc8D9779EC44d4",
        abi: LOSTANDFOUNDCONTRACT2ABI,
      }
    },
  },
};
