import { AssetMetadata } from './types'

/**
 * Metadata service for handling on-chain and off-chain metadata
 */
export class MetadataService {
  private baseUrl: string

  constructor(baseUrl: string = 'https://arweave.net') {
    this.baseUrl = baseUrl
  }

  /**
   * Upload metadata to Arweave
   */
  async uploadMetadata(metadata: AssetMetadata): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/tx`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: JSON.stringify(metadata),
          tags: [
            { name: 'Content-Type', value: 'application/json' },
            { name: 'App-Name', value: 'RWA-Portal' },
            { name: 'App-Version', value: '1.0.0' },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to upload metadata: ${response.statusText}`)
      }

      const result = await response.json()
      return result.id
    } catch (error) {
      console.error('Error uploading metadata:', error)
      throw error
    }
  }

  /**
   * Fetch metadata from Arweave
   */
  async fetchMetadata(uri: string): Promise<AssetMetadata | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${uri}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`)
      }

      const metadata = await response.json()
      return metadata as AssetMetadata
    } catch (error) {
      console.error('Error fetching metadata:', error)
      return null
    }
  }

  /**
   * Upload image to Arweave
   */
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${this.baseUrl}/tx`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`)
      }

      const result = await response.json()
      return result.id
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  /**
   * Create metadata object for an asset
   */
  createAssetMetadata(
    name: string,
    description: string,
    image: string,
    attributes: Array<{ trait_type: string; value: string | number }>,
    externalUrl?: string
  ): AssetMetadata {
    return {
      name,
      description,
      image,
      external_url: externalUrl || '',
      attributes,
      properties: {
        files: [
          {
            uri: image,
            type: 'image/png',
          },
        ],
        category: 'image',
      },
    }
  }

  /**
   * Validate metadata structure
   */
  validateMetadata(metadata: any): boolean {
    try {
      const requiredFields = ['name', 'description', 'image', 'attributes']
      
      for (const field of requiredFields) {
        if (!metadata[field]) {
          return false
        }
      }

      // Validate attributes structure
      if (!Array.isArray(metadata.attributes)) {
        return false
      }

      for (const attr of metadata.attributes) {
        if (!attr.trait_type || attr.value === undefined) {
          return false
        }
      }

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Get metadata URI for Arweave
   */
  getMetadataUri(transactionId: string): string {
    return `${this.baseUrl}/${transactionId}`
  }

  /**
   * Parse metadata URI to get transaction ID
   */
  parseMetadataUri(uri: string): string | null {
    try {
      const url = new URL(uri)
      const pathname = url.pathname
      const transactionId = pathname.split('/').pop()
      return transactionId || null
    } catch (error) {
      return null
    }
  }
}

/**
 * IPFS metadata service (alternative to Arweave)
 */
export class IPFSMetadataService {
  private gatewayUrl: string

  constructor(gatewayUrl: string = 'https://ipfs.io/ipfs') {
    this.gatewayUrl = gatewayUrl
  }

  /**
   * Upload metadata to IPFS
   */
  async uploadMetadata(metadata: AssetMetadata): Promise<string> {
    try {
      // This would typically use a service like Pinata or Infura
      // For demo purposes, we'll simulate the upload
      const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      })

      if (!response.ok) {
        throw new Error(`Failed to upload to IPFS: ${response.statusText}`)
      }

      const result = await response.json()
      return result.hash
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      throw error
    }
  }

  /**
   * Fetch metadata from IPFS
   */
  async fetchMetadata(hash: string): Promise<AssetMetadata | null> {
    try {
      const response = await fetch(`${this.gatewayUrl}/${hash}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.statusText}`)
      }

      const metadata = await response.json()
      return metadata as AssetMetadata
    } catch (error) {
      console.error('Error fetching from IPFS:', error)
      return null
    }
  }

  /**
   * Get metadata URI for IPFS
   */
  getMetadataUri(hash: string): string {
    return `${this.gatewayUrl}/${hash}`
  }
}

/**
 * Local metadata service for development
 */
export class LocalMetadataService {
  private storage: Map<string, AssetMetadata> = new Map()

  /**
   * Store metadata locally
   */
  async uploadMetadata(metadata: AssetMetadata): Promise<string> {
    const id = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.storage.set(id, metadata)
    return id
  }

  /**
   * Fetch metadata from local storage
   */
  async fetchMetadata(id: string): Promise<AssetMetadata | null> {
    return this.storage.get(id) || null
  }

  /**
   * Get metadata URI for local storage
   */
  getMetadataUri(id: string): string {
    return `local://${id}`
  }
}

/**
 * Factory function to create metadata service based on environment
 */
export function createMetadataService(provider: 'arweave' | 'ipfs' | 'local' = 'local') {
  switch (provider) {
    case 'arweave':
      return new MetadataService()
    case 'ipfs':
      return new IPFSMetadataService()
    case 'local':
    default:
      return new LocalMetadataService()
  }
}
