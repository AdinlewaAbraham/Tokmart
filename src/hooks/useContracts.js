import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MarketplaceAddress from '../frontend/contractsData/Marketplace-address.json';
import MarketplaceAbi from "../frontend/contractsData/Marketplace.json"
import NFTAddress from "../frontend/contractsData/NFT-address.json";
import NFTAbi from "../frontend/contractsData/NFT.json";

const useContracts = () => {
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState(null);
    const [nft, setNFT] = useState({});
    const [marketplace, setMarketplace] = useState({});
  
    useEffect(() => {
      const connectWeb3 = async () => {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts[0]);
  
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
  
          window.ethereum.on("chainChanged", (chainId) => {
            window.location.reload();
          });
  
          window.ethereum.on("accountsChanged", async function (accounts) {
            setAccount(accounts[0]);
            await connectWeb3();
          });
  
          await loadContracts(signer);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
  
      connectWeb3();
    }, []);
  
    const loadContracts = async (signer) => {
      const marketplace = new ethers.Contract(
        MarketplaceAddress.address,
        MarketplaceAbi.abi,
        signer
      );
      setMarketplace(marketplace);
  
      const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
      setNFT(nft);
    };
  
    return { loading, account, nft, marketplace };
  };
  
  export default useContracts;