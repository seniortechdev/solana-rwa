'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { XMarkIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Asset {
  id: string
  name: string
  tokenPrice: number
  availableSupply: number
  metadata?: {
    image: string
  }
}

interface BuyFractionModalProps {
  asset: Asset
  isOpen: boolean
  onClose: () => void
}

export function BuyFractionModal({ asset, isOpen, onClose }: BuyFractionModalProps) {
  const { connected, publicKey } = useWallet()
  const [tokenAmount, setTokenAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const usdcAmount = tokenAmount ? parseFloat(tokenAmount) * asset.tokenPrice : 0
  const maxTokens = Math.floor(asset.availableSupply)

  const handleBuy = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    if (!tokenAmount || parseFloat(tokenAmount) <= 0) {
      toast.error('Please enter a valid token amount')
      return
    }

    if (parseFloat(tokenAmount) > maxTokens) {
      toast.error(`Maximum ${maxTokens} tokens available`)
      return
    }

    setIsLoading(true)

    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Successfully purchased ${tokenAmount} tokens!`)
      onClose()
      setTokenAmount('')
    } catch (error) {
      toast.error('Transaction failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMaxTokens = () => {
    setTokenAmount(maxTokens.toString())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Buy Fraction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Asset Info */}
          <div className="flex items-center space-x-4">
            <img
              src={asset.metadata?.image || '/placeholder-asset.jpg'}
              alt={asset.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{asset.name}</h3>
              <p className="text-sm text-gray-600">Token Price: ${asset.tokenPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Token Amount Input */}
          <div>
            <label className="label">Token Amount</label>
            <div className="relative">
              <input
                type="number"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                placeholder="0"
                min="0"
                max={maxTokens}
                step="1"
                className="input pr-20"
              />
              <button
                onClick={handleMaxTokens}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                MAX
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available: {asset.availableSupply.toLocaleString()} tokens
            </p>
          </div>

          {/* Cost Breakdown */}
          {tokenAmount && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Token Amount
                </div>
                <span className="font-medium">{parseFloat(tokenAmount).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                  Price per Token
                </div>
                <span className="font-medium">${asset.tokenPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total Cost (USDC)</span>
                  <span className="font-semibold text-gray-900">${usdcAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  This transaction will be processed on the Solana blockchain. 
                  Make sure you have sufficient USDC balance.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleBuy}
              disabled={!tokenAmount || parseFloat(tokenAmount) <= 0 || isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Buy Fraction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
