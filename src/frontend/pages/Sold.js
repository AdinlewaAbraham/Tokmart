import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import Loading from "../components/loading/Loading";

const Sold = ({ marketplace, nft, account }) => {
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [soldItems, setSoldItems] = useState([]);

  // Load listed items and sold items from the marketplace for the current user
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount();
    let soldItems = [];

    for (let index = 1; index <= itemCount; index++) {
      const item = await marketplace.items(index);

      if (item.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        // define listed item object
        const soldItem = {
          totalPrice,
          price: item.price,
          itemId: item.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          sold: item.sold,
        };

        // Add listed item to sold items array if sold
        if (item.sold) {
          soldItems.push(soldItem);
        }
      }
    }

    setIsLoading(false);
    setSoldItems(soldItems);
  };

  // Load listed items and sold items when the component mounts
  useEffect(() => {
    loadListedItems();
  }, []);

  if (isLoading)
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
  return (
    <>
      {soldItems.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4 py-3">
          {soldItems.map((item, idx) => (
            <Col key={idx} className="overflow-hidden">
              <Card className="artnftcard">
                <Card.Img
                  style={{
                    borderRadius: "10px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                  variant="top"
                  src={item.image}
                />
                <span>
                  {" "}
                  #{ethers.utils.formatEther(item.itemId) * Math.pow(10, 18)}
                </span>
                <Card.Footer>
                  <span style={{ color: "grey", fontSize: "13px" }}>
                    Sold for:
                  </span>{" "}
                  {ethers.utils.formatEther(item.totalPrice)} ETH <br />
                  <span style={{ color: "grey", fontSize: "13px" }}>
                    Recieved:
                  </span>{" "}
                  {ethers.utils.formatEther(item.price)} ETH
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No sold assets </h2>
        </main>
      )}
    </>
  );
};

export default Sold;
