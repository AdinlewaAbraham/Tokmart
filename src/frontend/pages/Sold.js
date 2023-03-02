import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import Loading from "../components/loading/Loading";

const Sold = ({ marketplace, nft, account }) => {
  useEffect(() => {
    document.title = "Sold";
  }, []);
  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount();
    let listedItems = [];
    let soldItems = [];
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx);
      if (i.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId);
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          sold: i.sold,
        };
        listedItems.push(item);
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item);
      }
    }
    setLoading(false);
    setListedItems(listedItems);
    setSoldItems(soldItems);
  };
  useEffect(() => {
    loadListedItems();
  }, []);
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
            console.log(soldItems)
  return (
    <>
      {soldItems.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4 py-3">
          {soldItems.map((item, idx) => (
            <Col key={idx} className="overflow-hidden">
              <Card className="artnftcard">
                <Card.Img
                  style={{ borderRadius: "10px" }}
                  variant="top"
                  src={item.image}
                />
                <span>
                      {" "}
                      #
                      {ethers.utils.formatEther(item.itemId) * Math.pow(10, 18)}
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
