import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "./Navbar";
import Marketplace from "../pages/Marketplace.js";
import List from "../pages/List.js";
import Listings from "../pages/Listings.js";
import Purchases from "../pages/Purchases.js";
import Landing from "../pages/Home.js";

import "./App.css";
import useContracts from "../hooks/useContracts.js";

function App() {
  const { loading, account, nft, marketplace } = useContracts();

  const [accountChanged, setAccountChanged] = useState(false);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      setAccountChanged(true);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.off("accountsChanged", handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    if (accountChanged) {
      window.location.reload();
    }
  }, [accountChanged]);

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation account={account} />
        </>
        <div>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                minHeight: "80vh",
              }}
            >
              <p style={{ marginTop: "100px" }}>
                It appears that there is no active connection to MetaMask.
                Please ensure that you are connected by checking the connection
                status in the top right corner.
              </p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/marketplace"
                element={<Marketplace marketplace={marketplace} nft={nft} />}
              />
              <Route
                path="/list"
                element={<List marketplace={marketplace} nft={nft} />}
              />
              <Route
                path="/listings"
                element={
                  <Listings
                    marketplace={marketplace}
                    nft={nft}
                    account={account}
                  />
                }
              />
              <Route
                path="/purchases"
                element={
                  <Purchases
                    marketplace={marketplace}
                    nft={nft}
                    account={account}
                  />
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
