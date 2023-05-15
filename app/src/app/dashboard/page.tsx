'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@/contexts/WalletContext'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  EyeIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

// Mock data for demonstration
const mockPortfolio = {
  totalValue: 12500,
  totalTokens: 15000,
  assets: [
    {
      id: '1',
      name: 'Manhattan Office Building',
      type: 'RealEstate',
      tokensOwned: 5000,
      currentValue: 5000,
      tokenPrice: 1.0,
      change24h: 2.5,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100'
    },
    {
      id: '2',
      name: 'Van Gogh Starry Night',
      type: 'Art',
      tokensOwned: 3000,
      currentValue: 3000,
      tokenPrice: 1.0,
      change24h: -1.2,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100'
    },
    {
      id: '3',
      name: 'Amazon Rainforest Carbon Credits',
      type: 'Carbon',
      tokensOwned: 7000,
      currentValue: 4500,
      tokenPrice: 0.64,
      change24h: 5.8,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100'
    }
  ],
  transactions: [
    {
      id: '1',
      type: 'buy',
      asset: 'Manhattan Office Building',
      amount: 1000,
      price: 1.0,
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'sell',
      asset: 'Van Gogh Starry Night',
      amount: 500,
      price: 1.0,
      timestamp: '2024-01-14T15:45:00Z',
      status: 'completed'
    },
    {
      id: '3',
      type: 'buy',
      asset: 'Amazon Rainforest Carbon Credits',
      amount: 2000,
      price: 0.64,
      timestamp: '2024-01-13T09:20:00Z',
      status: 'completed'
    }
  ]
}

export default function DashboardPage() {
  const { connected, publicKey } = useWallet()
  const [portfolio, setPortfolio] = useState(mockPortfolio)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">Please connect your wallet to view your dashboard</p>
          <WalletMultiButton />
        </div>
      </div>
    )
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
              <Link href="/assets" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Assets
              </Link>
              <Link href="/dashboard" className="text-primary-600 font-medium px-3 py-2 rounded-md text-sm">
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your portfolio overview.
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${portfolio.totalValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Portfolio Value</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {portfolio.totalTokens.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Tokens Owned</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUpIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-green-600">+12.5%</div>
                <div className="text-sm text-gray-600">24h Change</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {portfolio.assets.length}
                </div>
                <div className="text-sm text-gray-600">Assets Owned</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio Assets */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Assets</h2>
                <Link href="/assets" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All Assets
                </Link>
              </div>
              
              <div className="space-y-4">
                {portfolio.assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={asset.image}
                        alt={asset.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{asset.name}</h3>
                        <p className="text-sm text-gray-600">{asset.type}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {asset.tokensOwned.toLocaleString()} tokens
                      </div>
                      <div className="text-sm text-gray-600">
                        ${asset.currentValue.toLocaleString()}
                      </div>
                      <div className={`text-sm flex items-center ${
                        asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {asset.change24h >= 0 ? (
                          <ArrowUpRightIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRightIcon className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(asset.change24h)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <Link href="/transactions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {portfolio.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {tx.type === 'buy' ? (
                          <ArrowUpRightIcon className={`h-4 w-4 ${
                            tx.type === 'buy' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        ) : (
                          <ArrowDownRightIcon className={`h-4 w-4 ${
                            tx.type === 'buy' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.amount.toLocaleString()} tokens
                        </div>
                        <div className="text-sm text-gray-600">{tx.asset}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${(tx.amount * tx.price).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/assets" className="w-full btn-primary text-center block">
                  Browse Assets
                </Link>
                <Link href="/assets" className="w-full btn-outline text-center block">
                  Create Asset
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
