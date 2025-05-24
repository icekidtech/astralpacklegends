"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useReadContract } from "wagmi"
import { Wallet, Star, ArrowRight } from "lucide-react"
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  fetchNFTMetadata,
  getRandomTokenIds,
  type NFTMetadata,
} from "../utils/contract"

interface FeaturedNFT {
  tokenId: number
  metadata: NFTMetadata | null
  loading: boolean
}

export default function Home() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const [featuredNFTs, setFeaturedNFTs] = useState<FeaturedNFT[]>([])

  // Get unminted tokens count
  const { data: unmintedTokens } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getUnmintedTokens",
  })

  const remainingCount = unmintedTokens ? unmintedTokens.length : 0

  // Load featured NFTs
  const loadFeaturedNFTs = async () => {
    const tokenIds = getRandomTokenIds(5)
    const nfts: FeaturedNFT[] = tokenIds.map((id) => ({
      tokenId: id,
      metadata: null,
      loading: true,
    }))

    setFeaturedNFTs(nfts)

    // Fetch metadata for each NFT
    for (let i = 0; i < tokenIds.length; i++) {
      const metadata = await fetchNFTMetadata(tokenIds[i])
      setFeaturedNFTs((prev) => prev.map((nft, index) => (index === i ? { ...nft, metadata, loading: false } : nft)))
    }
  }

  useEffect(() => {
    loadFeaturedNFTs()

    // Refresh featured NFTs every 5 seconds
    const interval = setInterval(loadFeaturedNFTs, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-cosmic-blue glow mb-4">Welcome to AstralPackLegends</h1>
        <p className="text-xl text-cosmic-blue/80 mb-6">Mint Your Cosmic NFT</p>
        <div className="text-lg text-cosmic-gold glow-gold">Remaining NFTs: {remainingCount} out of 104</div>
      </motion.div>

      {/* Wallet Connection */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center mb-12"
      >
        {!isConnected ? (
          <div className="flex flex-col items-center gap-4">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="flex items-center gap-3 bg-cosmic-purple hover:bg-cosmic-purple/80 text-white glow-purple rounded-lg px-8 py-4 transition-all duration-300 transform hover:scale-105"
                >
                  <Wallet className="w-6 h-6" />
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <ConnectButton />
            <button
              onClick={() => navigate("/mint")}
              className="flex items-center gap-3 bg-cosmic-blue hover:bg-cosmic-blue/80 text-white glow rounded-lg px-8 py-4 transition-all duration-300 transform hover:scale-105"
            >
              Go to Minting
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Featured NFTs */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-cosmic-blue glow text-center mb-8">Featured Cosmic Legends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {featuredNFTs.map((nft, index) => (
            <motion.div
              key={`${nft.tokenId}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-cosmic-medium border-cosmic-blue border-2 rounded-lg p-4 glow hover:glow-purple transition-all duration-300"
            >
              {nft.loading ? (
                <div className="animate-pulse">
                  <div className="bg-cosmic-light rounded-md w-full h-48 mb-4"></div>
                  <div className="bg-cosmic-light rounded w-3/4 h-4"></div>
                </div>
              ) : nft.metadata ? (
                <>
                  <img
                    src={
                      nft.metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") || "/placeholder.svg"
                    }
                    alt={nft.metadata.name}
                    className="rounded-md w-full h-48 object-cover mb-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      target.nextElementSibling?.classList.remove("hidden")
                    }}
                  />
                  <div className="hidden flex items-center justify-center h-48 bg-cosmic-light rounded-md mb-4">
                    <Star className="w-12 h-12 text-cosmic-gold" />
                  </div>
                  <h3 className="text-cosmic-blue font-semibold text-center">{nft.metadata.name}</h3>
                  <p className="text-cosmic-gold text-sm text-center mt-1">Token #{nft.tokenId}</p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-cosmic-light rounded-md mb-4">
                  <Star className="w-12 h-12 text-cosmic-gold mb-2" />
                  <p className="text-cosmic-blue text-sm text-center">Failed to Load NFT</p>
                  <p className="text-cosmic-gold text-xs text-center mt-1">Token #{nft.tokenId}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
