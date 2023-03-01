import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import Loading from "../components/loading/Loading";
import "../components/home/topSection/Topsection.css";
//import useListedItems from "../../hooks/useListedItems"

function renderSoldItems(items) {
  return (
    <>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card className="artnftcard">
              <Card.Img
                style={{ borderRadius: "10px" }}
                variant="top"
                src={item.image}
              />
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
    </>
  );
}

export default function MyListedItems({ marketplace, nft, account }) {
  useEffect(() => {
    document.title = "Listings";
  }, []);

  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
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
  const updatePrice = async (item) => {
    let price = 0.01;
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.updatePrice(item.itemId, listingPrice)).wait();
    console.log("updated price suc");
  };
  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ? (
        <div className="px-5 py-3 container">
          <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card className="artnftcardtwo">
                  <Card.Img
                    className="artnftcardimg"
                    variant="top"
                    src={item.image}
                  />
                  <p style={{ fontSize: "20px" }}>{item.name}</p>
                  <p style={{ color: "grey" }}>{item.description}</p>
                  <p style={{ color: "#6cf17e" }}>
                    {ethers.utils.formatEther(item.totalPrice)} ETH
                  </p>
                  <button
                    onClick={() => {
                      setshowInput(!showInput);
                    }}
                  >
                    change price
                  </button>
                  {showInput && (
                    <>
                      <input placeholder="Enter new price" />
                      <button
                        onClick={() => {
                          updatePrice(item);
                        }}
                      >
                        update price
                      </button>
                    </>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
          {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
}
