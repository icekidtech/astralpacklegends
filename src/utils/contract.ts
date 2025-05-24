export const CONTRACT_ABI = [
  {
    inputs: [],
    name: "mintRandomNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getUnmintedTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "NFTMinted",
    type: "event",
  },
] as const

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xYourContractAddressHere"

export const METADATA_BASE_URI =
  "https://gateway.pinata.cloud/ipfs/bafybeibakn3p7jleefqdzxe2fpjzlglbb7fkdo3bwl3uobq6de4ekuptxi"

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

export const fetchNFTMetadata = async (tokenId: number): Promise<NFTMetadata | null> => {
  try {
    const response = await fetch(`${METADATA_BASE_URI}/${tokenId}.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const metadata = await response.json()
    return metadata
  } catch (error) {
    console.error(`Failed to fetch metadata for token ${tokenId}:`, error)
    return null
  }
}

export const getRandomTokenIds = (count = 5): number[] => {
  const tokenIds: number[] = []
  while (tokenIds.length < count) {
    const randomId = Math.floor(Math.random() * 104) + 1
    if (!tokenIds.includes(randomId)) {
      tokenIds.push(randomId)
    }
  }
  return tokenIds
}
