import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Loading from "../components/loading/Loading";
import "../components/home/topSection/Topsection.css";
import React from "react";

const Listings = ({ marketplace, nft, account }) => {
  // Set the document title to "Listings"
  useEffect(() => {
    document.title = "Listings";
  }, []);

  // State variables for error, listed items, price, loading, sold items, and show input
  const [error, setError] = useState(false);
  const [listedItems, setListedItems] = useState([]);
  const [price, setPrice] = useState();
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);

  // Load all the listed items for the current user
  const loadListedItems = async () => {
    // Get the total number of items
    const itemCount = await marketplace.itemCount();
    let listedItems = [];
    // Loop through all the items
    for (let index = 1; index <= itemCount; index++) {
      const item = await marketplace.items(index);
      // Check if the item was listed by the current user
      if (item.owner.toLowerCase() === account) {
        // Get the URI for the NFT
        const uri = await nft.tokenURI(item.tokenId);
        // Fetch the metadata for the NFT from IPFS using the URI
        const response = await fetch(uri);
        const metadata = await response.json();
        // Get the total price of the item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        // Create a listed item object
        let listedItem = {
          totalPrice,
          price: item.price,
          itemId: item.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          sold: item.sold,
        };
        // If the item hasn't been sold yet, add it to the list of listed items
        if (!item.sold) listedItems.push(listedItem);
      }
    }
    // Update the state variables
    setLoading(false);
    setListedItems(listedItems);
  };

  // Load the listed items when the component mounts
  useEffect(() => {
    loadListedItems();
  }, []);

  // Display a loading spinner if the component is still loading
  if (loading)
    return (
      <main
        style={{
          padding: "1rem 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="center-spinner"
      >
        <Loading />
      </main>
    );

  // Update the price of a listed item
  const updatePrice = async (item) => {
    // Check if the price is valid
    if (price == null || price <= 0) {
      setError(true);
      return null;
    }
    // Give the marketplace contract permission to manage the user's NFTs
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    // Convert the listing price to wei and update the item's price
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.updatePrice(item.itemId, listingPrice)).wait();
  };
  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ? (
        <div className="px-5 py-3 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card className="artnftcardtwo">
                  <Card.Img
                    className="artnftcardimg"
                    variant="top"
                    src={item.image}
                    style={{
                      borderRadius: "10px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <p style={{ fontSize: "20px" }}>
                    {item.name}{" "}
                    <span>
                      {" "}
                      #
                      {ethers.utils.formatEther(item.itemId) * Math.pow(10, 18)}
                    </span>
                  </p>
                  <p style={{ color: "grey" }}>{item.description}</p>
                  <p style={{ color: "#6cf17e" }}>
                    {ethers.utils.formatEther(item.totalPrice)} ETH
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    style={{ backgroundColor: "#34a343", border: "none" }}
                    onClick={() => {
                      setShowInput(!showInput);
                    }}
                  >
                    change price
                  </Button>
                  {showInput && (
                    <>
                      <Form.Control
                        placeholder="Enter new price"
                        size="lg"
                        type="number"
                        value={price}
                        min={0}
                        onChange={(e) => {
                          setPrice(e.target.value);
                        }}
                        className="my-1"
                      />
                      {error && (
                        <p className="text-danger">price must be above 0</p>
                      )}
                      <Button
                        variant="primary"
                        size="lg"
                        style={{ backgroundColor: "#34a343", border: "none" }}
                        onClick={() => {
                          updatePrice(item);
                        }}
                      >
                        update price
                      </Button>
                    </>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets </h2>
        </main>
      )}
    </div>
  );
};

export default Listings;
