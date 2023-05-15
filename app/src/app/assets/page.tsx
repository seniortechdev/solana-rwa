'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@/contexts/WalletContext'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PlusIcon,
  BuildingOffice2Icon,
  PaintBrushIcon,
  LeafIcon,
  HomeIcon,
  CubeIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { AssetCard } from '@/components/AssetCard'
import { CreateAssetModal } from '@/components/CreateAssetModal'

// Mock data for demonstration
const mockAssets = [
  {
    id: '1',
    name: 'Manhattan Office Building',
    description: 'Premium office space in the heart of Manhattan',
    valuation: 5000000,
    assetType: 'RealEstate',
    totalSupply: 1000000,
    mintedSupply: 750000,
    tokenPrice: 5.0,
    marketCap: 5000000,
    availableSupply: 250000,
    metadata: {
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
      attributes: [
        { trait_type: 'Location', value: 'Manhattan, NY' },
        { trait_type: 'Type', value: 'Commercial' },
        { trait_type: 'Year Built', value: '2018' }
      ]
    }
  },
  {
    id: '2',
    name: 'Van Gogh Starry Night',
    description: 'Digital representation of the famous painting',
    valuation: 2000000,
    assetType: 'Art',
    totalSupply: 500000,
    mintedSupply: 300000,
    tokenPrice: 4.0,
    marketCap: 2000000,
    availableSupply: 200000,
    metadata: {
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500',
      attributes: [
        { trait_type: 'Artist', value: 'Vincent van Gogh' },
        { trait_type: 'Year', value: '1889' },
        { trait_type: 'Medium', value: 'Digital' }
      ]
    }
  },
  {
    id: '3',
    name: 'Amazon Rainforest Carbon Credits',
    description: 'Carbon offset credits from protected Amazon rainforest',
    valuation: 1000000,
    assetType: 'Carbon',
    totalSupply: 1000000,
    mintedSupply: 500000,
    tokenPrice: 1.0,
    marketCap: 1000000,
    availableSupply: 500000,
    metadata: {
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
      attributes: [
        { trait_type: 'Location', value: 'Amazon Rainforest' },
        { trait_type: 'Type', value: 'Carbon Credits' },
        { trait_type: 'Certification', value: 'Verified' }
      ]
    }
  }
]

const assetTypeIcons = {
  RealEstate: HomeIcon,
  Art: PaintBrushIcon,
  Carbon: LeafIcon,
  Land: BuildingOffice2Icon,
  Commodity: CubeIcon,
  Other: QuestionMarkCircleIcon,
}

export default function AssetsPage() {
  const { connected } = useWallet()
  const [assets, setAssets] = useState(mockAssets)
  const [filteredAssets, setFilteredAssets] = useState(mockAssets)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let filtered = assets

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter(asset => asset.assetType === selectedType)
    }

    setFilteredAssets(filtered)
  }, [assets, searchTerm, selectedType])

  const assetTypes = ['All', 'RealEstate', 'Art', 'Carbon', 'Land', 'Commodity', 'Other']

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gradient">RWA Portal</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/assets" className="text-primary-600 font-medium px-3 py-2 rounded-md text-sm">
                Assets
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tokenized Assets</h1>
              <p className="text-gray-600 mt-2">
                Discover and invest in real-world assets tokenized on Solana
              </p>
            </div>
            {connected && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary mt-4 sm:mt-0 flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Asset
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Asset Type Filter */}
            <div className="lg:w-64">
              <div className="relative">
                <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="input pl-10 appearance-none"
                >
                  {assetTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-2xl font-bold text-primary-600">
              {filteredAssets.length}
            </div>
            <div className="text-gray-600">Total Assets</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-green-600">
              ${filteredAssets.reduce((sum, asset) => sum + asset.marketCap, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Market Cap</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-blue-600">
              {filteredAssets.reduce((sum, asset) => sum + asset.mintedSupply, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Tokens Minted</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-purple-600">
              {filteredAssets.reduce((sum, asset) => sum + asset.availableSupply, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Available Supply</div>
          </div>
        </div>

        {/* Assets Grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BuildingOffice2Icon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedType !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'No assets have been tokenized yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Create Asset Modal */}
      {showCreateModal && (
        <CreateAssetModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newAsset) => {
            setAssets([newAsset, ...assets])
            setShowCreateModal(false)
          }}
        />
      )}
    </div>
  )
}
