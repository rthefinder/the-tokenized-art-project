import { z } from 'zod';

/**
 * Artwork Metadata Schema
 */
export const ArtworkMetadataSchema = z.object({
  tokenId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  artist: z.string(), // Ethereum address
  medium: z.string(),
  creationDate: z.number(), // Unix timestamp
  artworkHash: z.string(), // bytes32 hash
  royaltyPercentage: z.number().min(0).max(10000), // Basis points
  imageUrl: z.string().url().optional(),
  animationUrl: z.string().url().optional(),
  externalUrl: z.string().url().optional(),
  attributes: z
    .array(
      z.object({
        trait_type: z.string(),
        value: z.union([z.string(), z.number()]),
      })
    )
    .optional(),
});

export type ArtworkMetadata = z.infer<typeof ArtworkMetadataSchema>;

/**
 * Edition Metadata Schema
 */
export const EditionMetadataSchema = ArtworkMetadataSchema.extend({
  editionNumber: z.number().optional(),
  maxSupply: z.number(),
  currentSupply: z.number(),
});

export type EditionMetadata = z.infer<typeof EditionMetadataSchema>;

/**
 * Listing Schema
 */
export const ListingSchema = z.object({
  listingId: z.string(),
  seller: z.string(), // Ethereum address
  nftContract: z.string(), // Ethereum address
  tokenId: z.string(),
  price: z.string(), // Wei amount as string
  amount: z.number(),
  isERC1155: z.boolean(),
  active: z.boolean(),
  createdAt: z.number(),
});

export type Listing = z.infer<typeof ListingSchema>;

/**
 * Sale Event Schema
 */
export const SaleEventSchema = z.object({
  listingId: z.string(),
  buyer: z.string(),
  seller: z.string(),
  price: z.string(),
  royaltyAmount: z.string(),
  platformFeeAmount: z.string(),
  timestamp: z.number(),
  transactionHash: z.string(),
});

export type SaleEvent = z.infer<typeof SaleEventSchema>;

/**
 * Provenance Event Schema
 */
export const ProvenanceEventSchema = z.object({
  type: z.enum(['mint', 'transfer', 'sale', 'list']),
  from: z.string().nullable(),
  to: z.string().nullable(),
  price: z.string().optional(),
  timestamp: z.number(),
  transactionHash: z.string(),
  blockNumber: z.number(),
});

export type ProvenanceEvent = z.infer<typeof ProvenanceEventSchema>;

/**
 * Full Artwork with Provenance
 */
export const ArtworkWithProvenanceSchema = ArtworkMetadataSchema.extend({
  owner: z.string(),
  provenance: z.array(ProvenanceEventSchema),
});

export type ArtworkWithProvenance = z.infer<typeof ArtworkWithProvenanceSchema>;
