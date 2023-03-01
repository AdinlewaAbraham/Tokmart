import { useState, useEffect } from 'react';
export function useLoadMarketplaceItems(marketplace, nft) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchMarketplaceItems() {
      const itemCount = await marketplace.itemCount();
      const items = [];

      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.items(i);
        if (item.sold) {
          continue;
        }

        const uri = await nft.tokenURI(item.tokenId);
        const response = await fetch(uri);
        const metadata = await response.json();
        const totalPrice = await marketplace.getTotalPrice(item.itemId);

        const formattedItem = {
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        };

        items.push(formattedItem);
      }

      setLoading(false);
      setItems(items);
    }

    fetchMarketplaceItems();
  }, [marketplace, nft]);

  return [loading, items];
}
//export default useMarketplaceItems;