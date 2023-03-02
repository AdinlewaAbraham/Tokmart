import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Loading from "../components/loading/Loading";
import "../components/home/topSection/Topsection.css";
import React from "react";

const Listings = ({ marketplace, nft, account }) => {
  useEffect(() => {
    document.title = "Listings";
  }, []);
  const [error, seterror] = useState(false);
  const [listedItems, setListedItems] = useState([]);
  const [price, setprice] = useState();
  const [loading, setLoading] = useState(true);
  const [soldItems, setSoldItems] = useState([]);
  const [showInput, setshowInput] = useState(false);
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
        if (!i.sold) listedItems.push(item);
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
  const updatePrice = async (item) => {
    if (price == null || price <= 0) {
      seterror(true);
      return null;
    }
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
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
                      setshowInput(!showInput);
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
                          setprice(e.target.value);
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
