import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import Loading from "../components/loading/Loading";
import usePurchasedItems from "../../hooks/usePurchasedItems";

export default function MyPurchases({ marketplace, nft, account }) {
  const { loading, purchases } = usePurchasedItems({
    marketplace,
    nft,
    account,
  });
  useEffect(() => {
    document.title = "Purchases";
  }, []);
  const [price, setprice] = useState(0);
  const relist = async (item) => {
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.relistItem(item.itemId, listingPrice)).wait();
    console.log("relist suc");
  };
  if (loading) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>
          <Loading />
        </h2>
      </main>
    );
  }
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => {
              // Check if the item is sold by checking its itemSold value
              if (!item.itemSold) {
                return null; // skip sold items
              }
              return (
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
                      id={idx}
                      onClick={() => {
                        relist(item);
                      }}
                      type=""
                    >
                      relist
                    </button>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No purchases</h2>
        </main>
      )}
    </div>
  );
}
