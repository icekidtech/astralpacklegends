import { useState, useEffect } from 'react';
import { fetchNFTMetadata, getProxiedImageUrl, NFTMetadata } from '../utils/contract';

interface NFTCardProps {
  tokenId: number;
}

const NFTCard: React.FC<NFTCardProps> = ({ tokenId }) => {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        const data = await fetchNFTMetadata(tokenId);
        setMetadata(data);
      } catch (err) {
        setError("Failed to load NFT metadata");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadMetadata();
  }, [tokenId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!metadata) return <div>No metadata found</div>;
  
  return (
    <div className="nft-card">
      <h3>{metadata.name}</h3>
      {metadata.image && (
        <img 
          src={getProxiedImageUrl(metadata.image)}
          alt={metadata.name || `NFT #${tokenId}`}
          className="nft-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      )}
      <p>{metadata.description}</p>
      {/* Render additional metadata properties */}
    </div>
  );
};

export default NFTCard;