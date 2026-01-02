/**
 * Supported Networks
 */
export enum Network {
  MAINNET = 1,
  SEPOLIA = 11155111,
  LOCALHOST = 31337,
}

/**
 * Contract Addresses (to be configured per network)
 */
export interface ContractAddresses {
  artNFT721: string;
  artNFT1155: string;
  artToken: string;
  marketplace: string;
}

/**
 * Default contract addresses (placeholder)
 */
export const CONTRACT_ADDRESSES: Record<Network, Partial<ContractAddresses>> = {
  [Network.MAINNET]: {
    // To be deployed
  },
  [Network.SEPOLIA]: {
    // To be deployed
  },
  [Network.LOCALHOST]: {
    // Deployed during local testing
  },
};

/**
 * IPFS Configuration
 */
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
export const IPFS_API_ENDPOINT = 'https://api.web3.storage';

/**
 * Platform Constants
 */
export const PLATFORM_FEE_BASIS_POINTS = 250; // 2.5%
export const MAX_ROYALTY_BASIS_POINTS = 10000; // 100%
export const TYPICAL_ROYALTY_BASIS_POINTS = 500; // 5%

/**
 * Media Types
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  MODEL_3D = '3d-model',
}

/**
 * Artwork Mediums
 */
export const ARTWORK_MEDIUMS = [
  'Digital Art',
  'Oil on Canvas',
  'Acrylic on Canvas',
  'Watercolor',
  'Photography',
  'Sculpture',
  'Mixed Media',
  'Generative Art',
  'Video Art',
  'Sound Art',
  '3D Art',
  'Installation',
  'Performance',
  'Other',
] as const;

export type ArtworkMedium = (typeof ARTWORK_MEDIUMS)[number];

/**
 * Listing Status
 */
export enum ListingStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

/**
 * Token Standards
 */
export enum TokenStandard {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  ARTWORKS: '/api/artworks',
  LISTINGS: '/api/listings',
  ARTISTS: '/api/artists',
  COLLECTIONS: '/api/collections',
  PROVENANCE: '/api/provenance',
};
