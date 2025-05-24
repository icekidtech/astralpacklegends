"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { ArrowLeft, Loader } from "lucide-react"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/contract"
import { parseEventLogs } from "viem"

export default function Mint() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Get unminted tokens count
  const { data: unmintedTokens } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getUnmintedTokens",
  })

  const remainingCount = unmintedTokens ? unmintedTokens.length : 0

  // Contract write hook
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract()

  // Wait for transaction
  const {
    isLoading: isTransactionLoading,
    isSuccess: isTransactionSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      navigate("/")
    }
  }, [isConnected, navigate])

  // Handle successful transaction
  useEffect(() => {
    if (isTransactionSuccess && receipt) {
      try {
        const logs = parseEventLogs({
          abi: CONTRACT_ABI,
          logs: receipt.logs,
        })

        const mintEvent = logs.find((log) => log.eventName === "NFTMinted")
        if (mintEvent && "args" in mintEvent) {
          const tokenId = Number(mintEvent.args.tokenId)
          setMintedTokenId(tokenId)
          setIsSuccess(true)
        }
      } catch (error) {
        console.error("Error parsing logs:", error)
        setIsSuccess(true) // Still show success even if we can't parse the token ID
      }
    }
  }, [isTransactionSuccess, receipt])

  const handleMint = async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "mintRandomNFT",
      })
    } catch (error) {
      console.error("Minting error:", error)
    }
  }

  const isLoading = isWritePending || isTransactionLoading

  if (!isConnected) {
    return null // Will redirect
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto p-6"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cosmic-blue glow mb-4">Mint Your Astral Pack Legend</h1>
        <div className="text-lg text-cosmic-gold glow-gold">Remaining: {remainingCount} out of 104</div>
      </div>

      {/* Mint Section */}
      <div className="bg-cosmic-medium border-cosmic-blue border-2 rounded-lg p-8 glow text-center">
        {!isSuccess ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMint}
              disabled={isLoading || remainingCount === 0}
              className={`
                flex items-center justify-center gap-3 mx-auto
                ${
                  isLoading
                    ? "bg-cosmic-purple/50 cursor-not-allowed"
                    : remainingCount === 0
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-cosmic-purple hover:bg-cosmic-purple/80 animate-pulse-glow"
                }
                text-white glow-purple rounded-lg px-12 py-6 text-xl font-semibold
                transition-all duration-300 min-w-[250px]
              `}
            >
              {isLoading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  {isWritePending ? "Confirm in Wallet..." : "Minting..."}
                </>
              ) : remainingCount === 0 ? (
                "All NFTs Minted!"
              ) : (
                "Mint Random NFT"
              )}
            </motion.button>

            {writeError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg"
              >
                <p className="text-red-300">Transaction failed: {writeError.message}</p>
              </motion.div>
            )}

            <p className="text-cosmic-blue/80 mt-6 text-sm">
              Click the button above to mint a random Astral Pack Legend NFT
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-cosmic-gold glow-gold mb-4">Congratulations!</h2>
            <p className="text-xl text-cosmic-blue mb-8">
              {mintedTokenId ? `You minted token #${mintedTokenId}!` : "You successfully minted an Astral Pack Legend!"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 mx-auto bg-cosmic-blue hover:bg-cosmic-blue/80 text-white glow rounded-lg px-8 py-4 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6" />
              Back to Home
            </button>
          </motion.div>
        )}
      </div>

      {/* Back Button (when not in success state) */}
      {!isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mx-auto text-cosmic-blue hover:text-cosmic-blue/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
