import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ethers } from "ethers";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import Loading from "../components/loading/Loading";
import usePurchasedItems from "../hooks/usePurchasedItems";

export default function Purchases({ marketplace, nft, account }) {
  // Load the user's purchased items using a custom hook.
  const { loading, purchases, setPurchases } = usePurchasedItems({
    marketplace,
    nft,
    account,
  });

  const [accountChanged, setAccountChanged] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    // Set the page title on initial load.
    document.title = "Purchases";
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

  // State variables for relisting items.
  const [error, setError] = useState(false);
  const [newPrice, setNewPrice] = useState();
  const [showRelist, setShowRelist] = useState(false);

  const navigate = useNavigate();
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

    navigate("/marketplace", { replace: true });
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

  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Form className="py-3">
            <Row className="align-items-center">
              <Col sm={12} md={6}>
                <Form.Control
                  type="text"
                  placeholder="Search by name or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="">Filter by</option>
                  <option value="price-low-to-high">Price: Low to High</option>
                  <option value="price-high-to-low">Price: High to Low</option>
                  <option value="date-newest-to-oldest">
                    Date: Newest to Oldest
                  </option>
                  <option value="date-oldest-to-newest">
                    Date: Oldest to Newest
                  </option>
                </Form.Select>
              </Col>
            </Row>
          </Form>

          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases
              .filter(
                (item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => {
                const totalPriceA = ethers.utils.formatEther(a.totalPrice._hex);
                const totalPriceB = ethers.utils.formatEther(b.totalPrice._hex);
                const dateA = ethers.utils.formatEther(a.itemId._hex);
                const dateB = ethers.utils.formatEther(b.itemId._hex);
                switch (filterValue) {
                  case "price-low-to-high":
                    return totalPriceA - totalPriceB;
                  case "price-high-to-low":
                    return totalPriceB - totalPriceA;
                  case "date-newest-to-oldest":
                    return dateB - dateA;
                  case "date-oldest-to-newest":
                    return dateA - dateB;
                  default:
                    return 0;
                }
              })
              .map((item, idx) => {
                return (
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
                          backgroundColor:
                            account.toLowerCase() ===
                              item.owner.toLowerCase() && item.itemSold
                              ? "#34a343"
                              : "grey",
                          border: "none",
                          cursor:
                            account.toLowerCase() ===
                              item.owner.toLowerCase() && item.itemSold
                              ? " pointer"
                              : "no-drop",
                        }}
                        onClick={() => {
                          if (
                            account.toLowerCase() ===
                              item.owner.toLowerCase() &&
                            item.itemSold
                          ) {
                            setShowRelist(!showRelist);
                          }
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
                            style={{
                              backgroundColor: "#34a343",
                              border: "none",
                            }}
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
