import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Button } from "react-bootstrap";
import Loading from "../components/loading/Loading";
import "../components/home/topSection/Topsection.css";

import { useLoadMarketplaceItems } from "../hooks/useLoadMarketplaceItems";
const Home = ({ marketplace, nft }) => {
  const [loading, items, setItems] = useLoadMarketplaceItems(marketplace, nft);

  useEffect(() => {
    document.title = "Marketplace";
  }, []);

  const BuyMarketItem = async (item) => {
    await (
      await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
    ).wait();
    const newItems = items.filter((i) => i.itemId !== item.itemId);
    setItems(newItems);
  };

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
  return (
    <div className="flex justify-center">
      {items.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card style={{ backgroundColor: "black", border: "none" }}>
                  <Card.Img
                    variant="top"
                    src={item.image}
                    style={{ borderRadius: "10px" }}
                  />
                  <Card.Body color="secondary">
                    <Card.Title>
                      {item.name}
                      <span>
                        {" "}
                        #
                        {ethers.utils.formatEther(item.itemId) *
                          Math.pow(10, 18)}
                      </span>
                    </Card.Title>
                    <Card.Text style={{ color: "grey" }}>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer style={{ padding: "0px" }}>
                    <div className="d-grid">
                      <Button
                        onClick={() => BuyMarketItem(item)}
                        variant="primary"
                        size="lg"
                        style={{ backgroundColor: "#34a343", border: "none" }}
                      >
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2 style={{ marginLeft: "50px", marginRight: "50px" }}>
            No listed assets
          </h2>
        </main>
      )}
    </div>
  );
};
export default Home;
