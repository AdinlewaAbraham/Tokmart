import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import Loading from "../components/loading/Loading";
import usePurchasedItems from "../hooks/usePurchasedItems";

export default function Purchases({ marketplace, nft, account }) {
  // Load the user's purchased items using a custom hook.
  const { loading, purchases } = usePurchasedItems({
    marketplace,
    nft,
    account,
  });

  // Set the page title on initial load.
  useEffect(() => {
    document.title = "Purchases";
  }, []);

  // State variables for relisting items.
  const [error, setError] = useState(false);
  const [newPrice, setNewPrice] = useState();
  const [showRelist, setShowRelist] = useState(false);

  const relistItem = async (item) => {
    if (newPrice == null || newPrice <= 0) {
      setError(true);
      return null;
    }

    // Set approval for the marketplace to manage the user's NFTs.
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();

    // Convert the new price to Ether and relist the item on the marketplace.
    const listingPrice = ethers.utils.parseEther(newPrice.toString());
    await (await marketplace.relistItem(item.itemId, listingPrice)).wait();

  };

  // Render a loading spinner while the purchased items are loading.
  if (loading) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>
          <Loading />
        </h2>
      </main>
    );
  }

  // Render the purchased items list once they are loaded.
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => {
              return (
                <Col key={idx} className="overflow-hidden" onClick={()=>{console.log(item)}} >
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
                        setShowRelist(!showRelist);
                      }}
                    >
                      relist
                    </Button>
                    {showRelist && (
                      <>
                        <Form.Control
                          value={newPrice}
                          size="lg"
                          placeholder="Enter new price"
                          type="number"
                          min={0}
                          onChange={(e) => {
                            setNewPrice(e.target.value);
                            setError(false);
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
                            relistItem(item);
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
