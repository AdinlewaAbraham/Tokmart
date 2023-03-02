import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import Loading from "../components/loading/Loading";
import usePurchasedItems from "../hooks/usePurchasedItems";

export default function MyPurchases({ marketplace, nft, account }) {
  const { loading, purchases } = usePurchasedItems({
    marketplace,
    nft,
    account,
  });

  useEffect(() => {
    document.title = "Purchases";
  }, []);
  const [error, seterror] = useState(false);
  const [price, setprice] = useState();
  const [showRelist, setshowRelist] = useState(false);
  const relist = async (item) => {
    if (price == null || price <= 0) {
      seterror(true);
      return null;
    }
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.relistItem(item.itemId, listingPrice)).wait();
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
  console.log(purchases);
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => {
              return (
                <Col key={idx} className="overflow-hidden">
                  <Card className="artnftcardtwo">
                    <Card.Img
                      className="artnftcardimg"
                      variant="top"
                      src={item.image}
                    />
                    <p style={{ fontSize: "20px" }}>
                      {item.name}
                      <span>
                        {" "}
                        #
                        {ethers.utils.formatEther(item.itemId) *
                          Math.pow(10, 18)}
                      </span>
                    </p>
                    <p style={{ color: "grey" }}>{item.description}</p>
                    <p style={{ color: "#6cf17e" }}>
                      {ethers.utils.formatEther(item.totalPrice)} ETH
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      style={{
                        backgroundColor: "#34a343",
                        border: "none",
                        display:
                          account.toLowerCase() === item.owner.toLowerCase()
                            ? "block"
                            : "none",
                      }}
                      onClick={() => {
                        setshowRelist(!showRelist);
                      }}
                    >
                      relist
                    </Button>
                    {showRelist && (
                      <>
                        <Form.Control
                          value={price}
                          size="lg"
                          placeholder="Enter new price"
                          type="number"
                          min={0}
                          onChange={(e) => {
                            setprice(e.target.value);
                            seterror(false);
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
                          id={idx}
                          onClick={() => {
                            relist(item);
                          }}
                          type=""
                        >
                          make relist
                        </Button>
                      </>
                    )}
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
