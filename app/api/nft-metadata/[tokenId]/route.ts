import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { tokenId: string } }
) {
  try {
    // Fetch metadata from your NFT contract or IPFS
    const metadata = {
      name: `PATA NFT #${params.tokenId}`,
      description: "A unique PATA NFT reward",
      image: `https://your-nft-images.com/${params.tokenId}.png`,
      attributes: [
        {
          trait_type: "Rarity",
          value: "Rare" // This should be fetched from your contract
        }
      ]
    }

    return NextResponse.json(metadata)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch NFT metadata' },
      { status: 500 }
    )
  }
} 