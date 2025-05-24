import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { defineChain } from "viem"

const liskSepolia = defineChain({
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia-api.lisk.com"],
    },
  },
  blockExplorers: {
    default: { name: "Lisk Sepolia Explorer", url: "https://sepolia-blockscout.lisk.com" },
  },
  testnet: true,
})

export const config = getDefaultConfig({
  appName: "AstralPackLegends",
  projectId: "YOUR_PROJECT_ID", // Get this from WalletConnect Cloud
  chains: [liskSepolia],
  ssr: false,
})
