import { useState, useEffect } from 'react';

export function useLoadMarketplaceItems(marketplace, nft) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    /**
     * A function that fetches the list of items from the marketplace contract.
     * It loops through the item IDs returned from the contract and fetches their details.
     * It adds the details of unsold items to an array, which is then set as the `items` state.
     */
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

  // Return the loading state, items list, and setter for the items list
  return [loading, items, setItems];
}
