import { useState, useEffect } from "react";


const usePurchasedItems = ({ marketplace, nft, account }) => {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const loadPurchasedItems = async () => {
      // Query the marketplace contract to fetch all Bought events for the current account
      const filter = marketplace.filters.Bought(
        null,
        null,
        null,
        null,
        null,
        account
      );
      const results = await marketplace.queryFilter(filter);


      // Use a Set to ensure unique purchases and prevent duplicates
      const uniquePurchases = new Set();

      // Loop through each Bought event to fetch the associated NFT metadata and other details
      await Promise.all(
        results.map(async (i) => {
          i = i.args;
          const uri = await nft.tokenURI(i.tokenId);
          const response = await fetch(uri);
          const metadata = await response.json();
          const totalPrice = await marketplace.getTotalPrice(i.itemId);
          const itemSold = await marketplace.isItemSold(i.itemId);
          const owner = await marketplace.getItemOwner(i.itemId);

          // Create a formatted purchased item object
          const purchasedItem = {
            totalPrice,
            price: i.price,
            itemId: i.itemId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            itemSold,
            owner,
          };

          // Add the purchased item object to the Set to ensure uniqueness
          uniquePurchases.add(JSON.stringify(purchasedItem));
        })
      );

      // Convert the Set back to an array and remove duplicates
      const uniquePurchasesArray = removeDuplicates(
        Array.from(uniquePurchases).map((p) => JSON.parse(p))
      );

      setLoading(false);
      setPurchases(uniquePurchasesArray);
    };

    // Call the loadPurchasedItems function
    loadPurchasedItems();
  }, [marketplace, nft, account]);

  // Function to remove duplicates from the purchases array
  const removeDuplicates = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      const duplicate = seen.has(item.itemId.toString());
      seen.add(item.itemId.toString());
      return !duplicate;
    });
  };

  // Return the loading and purchases variables
  return { loading, purchases, setPurchases };
};

export default usePurchasedItems;
