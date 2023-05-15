'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface CreateAssetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (asset: any) => void
}

export function CreateAssetModal({ isOpen, onClose, onSuccess }: CreateAssetModalProps) {
  const { connected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    valuation: '',
    assetType: 'RealEstate',
    metadataUri: '',
    totalSupply: '',
    image: null as File | null,
  })

  const assetTypes = [
    { value: 'RealEstate', label: 'Real Estate' },
    { value: 'Art', label: 'Art' },
    { value: 'Carbon', label: 'Carbon Credits' },
    { value: 'Land', label: 'Land' },
    { value: 'Commodity', label: 'Commodity' },
    { value: 'Other', label: 'Other' },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected) {
      toast.error('Please connect your wallet')
      return
    }

    // Validate form
    if (!formData.name || !formData.description || !formData.valuation || !formData.totalSupply) {
      toast.error('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.valuation) <= 0 || parseFloat(formData.totalSupply) <= 0) {
      toast.error('Valuation and total supply must be greater than 0')
      return
    }

    setIsLoading(true)

    try {
      // Simulate asset creation
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newAsset = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        valuation: parseFloat(formData.valuation),
        assetType: formData.assetType,
        totalSupply: parseInt(formData.totalSupply),
        mintedSupply: 0,
        tokenPrice: parseFloat(formData.valuation) / parseInt(formData.totalSupply),
        marketCap: parseFloat(formData.valuation),
        availableSupply: parseInt(formData.totalSupply),
        metadata: {
          image: formData.image ? URL.createObjectURL(formData.image) : '/placeholder-asset.jpg',
          attributes: [
            { trait_type: 'Type', value: formData.assetType },
            { trait_type: 'Valuation', value: `$${parseFloat(formData.valuation).toLocaleString()}` },
          ]
        }
      }

      toast.success('Asset created successfully!')
      onSuccess(newAsset)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        valuation: '',
        assetType: 'RealEstate',
        metadataUri: '',
        totalSupply: '',
        image: null,
      })
    } catch (error) {
      toast.error('Failed to create asset. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Asset</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div>
              <label className="label">Asset Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Manhattan Office Building"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your asset..."
                rows={3}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Asset Type *</label>
              <select
                name="assetType"
                value={formData.assetType}
                onChange={handleInputChange}
                className="input"
                required
              >
                {assetTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Financial Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Total Valuation (USDC) *</label>
                <input
                  type="number"
                  name="valuation"
                  value={formData.valuation}
                  onChange={handleInputChange}
                  placeholder="1000000"
                  min="0"
                  step="1"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Total Token Supply *</label>
                <input
                  type="number"
                  name="totalSupply"
                  value={formData.totalSupply}
                  onChange={handleInputChange}
                  placeholder="1000000"
                  min="1"
                  step="1"
                  className="input"
                  required
                />
              </div>
            </div>

            {formData.valuation && formData.totalSupply && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  <strong>Token Price:</strong> ${(parseFloat(formData.valuation) / parseInt(formData.totalSupply)).toFixed(6)} USDC per token
                </div>
              </div>
            )}
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Media</h3>
            
            <div>
              <label className="label">Asset Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="label">Metadata URI (Optional)</label>
              <input
                type="url"
                name="metadataUri"
                value={formData.metadataUri}
                onChange={handleInputChange}
                placeholder="https://arweave.net/..."
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Link to detailed metadata (documents, certificates, etc.)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Asset...' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
