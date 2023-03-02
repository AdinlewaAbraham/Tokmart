import { useState, useEffect } from "react";

const usePurchasedItems = ({ marketplace, nft, account }) => {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const loadPurchasedItems = async () => {
      const filter = marketplace.filters.Bought(
        null,
        null,
        null,
        null,
        null,
        account
      );
      //check if sold
      const results = await marketplace.queryFilter(filter);
      const uniquePurchases = new Set();
      await Promise.all(
        results.map(async (i) => {
          i = i.args;
          const uri = await nft.tokenURI(i.tokenId);
          const response = await fetch(uri);
          const metadata = await response.json();
          const totalPrice = await marketplace.getTotalPrice(i.itemId);
          const itemSold = await marketplace.isItemSold(i.itemId);
          const owner = await marketplace.getItemOwner(i.itemId);
          let purchasedItem = {
            totalPrice,
            price: i.price,
            itemId: i.itemId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            itemSold,
            owner,
          };
          uniquePurchases.add(JSON.stringify(purchasedItem));
        })
      );
      const uniquePurchasesArray = removeDuplicates(
        Array.from(uniquePurchases).map((p) => JSON.parse(p))
      );

      setLoading(false);
      setPurchases(uniquePurchasesArray);
    };
    loadPurchasedItems();
  }, [marketplace, nft, account]);

  const removeDuplicates = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      const duplicate = seen.has(item.itemId.toString());
      seen.add(item.itemId.toString());
      return !duplicate;
    });
  };

  return { loading, purchases };
};

export default usePurchasedItems;
