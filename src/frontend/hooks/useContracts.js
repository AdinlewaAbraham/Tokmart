import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import marketplaceAddress from '../../frontend/contractsData/Marketplace-address.json';
import marketplaceAbi from "../../frontend/contractsData/Marketplace.json"
import nftAddress from "../../frontend/contractsData/NFT-address.json";
import nftAbi from "../../frontend/contractsData/NFT.json";


const useContracts = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNft] = useState({});
  const [marketplace, setMarketplace] = useState({});

  useEffect(() => {
    /**
     * Connects to the user's Web3 wallet and loads the NFT and marketplace contracts
     */
    const connectWeb3 = async () => {
      try {
        // Request access to the user's Ethereum accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        // Create a provider and signer using the Web3 provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Reload the page if the user changes their network
        window.ethereum.on("chainChanged", (chainId) => {
          window.location.reload();
        });

        // Update the connected account if the user switches to a different account
        window.ethereum.on("accountsChanged", async function (accounts) {
          setAccount(accounts[0]);
          await connectWeb3();
        });

        // Load the NFT and marketplace contracts
        await loadContracts(signer);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    connectWeb3();
  }, []);

 
  const loadContracts = async (signer) => {
    const marketplaceContract = new ethers.Contract(
      marketplaceAddress.address,
      marketplaceAbi.abi,
      signer
    );
    setMarketplace(marketplaceContract);

    const nftContract = new ethers.Contract(nftAddress.address, nftAbi.abi, signer);
    setNft(nftContract);
  };

  return { loading, account, nft, marketplace };
};

export default useContracts;
