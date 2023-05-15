'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { 
  BuildingOffice2Icon,
  PaintBrushIcon,
  LeafIcon,
  HomeIcon,
  CubeIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { BuyFractionModal } from './BuyFractionModal'

const assetTypeIcons = {
  RealEstate: HomeIcon,
  Art: PaintBrushIcon,
  Carbon: LeafIcon,
  Land: BuildingOffice2Icon,
  Commodity: CubeIcon,
  Other: QuestionMarkCircleIcon,
}

const assetTypeColors = {
  RealEstate: 'bg-blue-100 text-blue-800',
  Art: 'bg-purple-100 text-purple-800',
  Carbon: 'bg-green-100 text-green-800',
  Land: 'bg-yellow-100 text-yellow-800',
  Commodity: 'bg-orange-100 text-orange-800',
  Other: 'bg-gray-100 text-gray-800',
}

interface Asset {
  id: string
  name: string
  description: string
  valuation: number
  assetType: string
  totalSupply: number
  mintedSupply: number
  tokenPrice: number
  marketCap: number
  availableSupply: number
  metadata?: {
    image: string
    attributes: Array<{ trait_type: string; value: string | number }>
  }
}

interface AssetCardProps {
  asset: Asset
}

export function AssetCard({ asset }: AssetCardProps) {
  const { connected } = useWallet()
  const [showBuyModal, setShowBuyModal] = useState(false)

  const IconComponent = assetTypeIcons[asset.assetType as keyof typeof assetTypeIcons] || QuestionMarkCircleIcon
  const typeColor = assetTypeColors[asset.assetType as keyof typeof assetTypeColors] || 'bg-gray-100 text-gray-800'

  const progressPercentage = (asset.mintedSupply / asset.totalSupply) * 100

  return (
    <>
      <div className="card hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <img
            src={asset.metadata?.image || '/placeholder-asset.jpg'}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
              <IconComponent className="h-3 w-3 mr-1" />
              {asset.assetType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {asset.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {asset.description}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                Token Price
              </div>
              <div className="font-semibold text-gray-900">
                ${asset.tokenPrice.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <ChartBarIcon className="h-4 w-4 mr-1" />
                Market Cap
              </div>
              <div className="font-semibold text-gray-900">
                ${(asset.marketCap / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Tokens Minted</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{asset.mintedSupply.toLocaleString()}</span>
              <span>{asset.totalSupply.toLocaleString()}</span>
            </div>
          </div>

          {/* Available Supply */}
          <div className="flex items-center text-sm text-gray-600">
            <UsersIcon className="h-4 w-4 mr-1" />
            <span>{asset.availableSupply.toLocaleString()} tokens available</span>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <Link
              href={`/asset/${asset.id}`}
              className="flex-1 btn-outline text-center"
            >
              View Details
            </Link>
            {connected && asset.availableSupply > 0 && (
              <button
                onClick={() => setShowBuyModal(true)}
                className="flex-1 btn-primary"
              >
                Buy Fraction
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Buy Fraction Modal */}
      {showBuyModal && (
        <BuyFractionModal
          asset={asset}
          isOpen={showBuyModal}
          onClose={() => setShowBuyModal(false)}
        />
      )}
    </>
  )
}
