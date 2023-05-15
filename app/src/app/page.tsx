'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@/contexts/WalletContext'
import { 
  BuildingOffice2Icon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const features = [
  {
    name: 'Asset Tokenization',
    description: 'Transform real-world assets into tradeable digital tokens on Solana blockchain.',
    icon: BuildingOffice2Icon,
  },
  {
    name: 'Fractional Ownership',
    description: 'Split high-value assets into affordable fractions, enabling broader participation.',
    icon: ChartBarIcon,
  },
  {
    name: 'Secure Trading',
    description: 'Trade fractional ownership with built-in security and transparency.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'USDC Payments',
    description: 'Buy and sell fractions using USDC for stable, reliable transactions.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Global Access',
    description: 'Access to real-world assets from anywhere in the world, 24/7.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Community Driven',
    description: 'Join a growing community of asset tokenization enthusiasts.',
    icon: UserGroupIcon,
  },
]

const stats = [
  { name: 'Total Assets', value: '12' },
  { name: 'Total Value', value: '$2.4M' },
  { name: 'Active Users', value: '1,234' },
  { name: 'Trades Today', value: '89' },
]

export default function HomePage() {
  const { connected } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gradient">RWA Portal</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/assets" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
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

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Tokenize Real World Assets on{' '}
              <span className="text-gradient">Solana</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform physical assets into digital tokens. Enable fractional ownership, 
              global trading, and democratize access to premium real-world investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {connected ? (
                <Link href="/assets" className="btn-primary text-lg px-8 py-3">
                  Explore Assets
                </Link>
              ) : (
                <div className="btn-primary text-lg px-8 py-3 cursor-pointer">
                  <WalletMultiButton />
                </div>
              )}
              <Link href="/dashboard" className="btn-outline text-lg px-8 py-3">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RWA Portal?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on Solana for speed, security, and scalability. Experience the future of asset tokenization.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users already tokenizing and trading real-world assets on Solana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {connected ? (
              <Link href="/assets" className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Start Trading
              </Link>
            ) : (
              <div className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                <WalletMultiButton />
              </div>
            )}
            <Link href="/dashboard" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">RWA Portal</h3>
              <p className="text-gray-400">
                Democratizing access to real-world assets through blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Platform
              </h4>
              <ul className="space-y-2">
                <li><Link href="/assets" className="text-gray-400 hover:text-white">Assets</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API Docs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RWA Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
