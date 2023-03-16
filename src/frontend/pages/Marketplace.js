import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Button,Form } from "react-bootstrap";
import Loading from "../components/loading/Loading";
import "../components/home/topSection/Topsection.css";

import { useLoadMarketplaceItems } from "../hooks/useLoadMarketplaceItems";

const Marketplace = ({ marketplace, nft }) => {
  // Load marketplace items using custom hook
  const [loading, items, setItems] = useLoadMarketplaceItems(marketplace, nft);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    // Update document title
    document.title = "Marketplace";
  }, []);

  // This function handles the purchase of a market item.
  const buyMarketItem = async (item) => {
    await (
      await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
    ).wait();
    const newItems = items.filter((i) => i.itemId !== item.itemId);
    setItems(newItems);
  };

  // If `loading` is true, render a loading spinner.
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
            {items
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
                    return  dateA- dateB;
                  default:
                    return 0;
                }
              })
              .map((item, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card style={{ backgroundColor: "black", border: "none" }}>
                    <Card.Img
                      variant="top"
                      src={item.image}
                      style={{
                        borderRadius: "10px",
                        height: "200px",
                        objectFit: "cover",
                      }}
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
                          onClick={() => buyMarketItem(item)}
                          variant="primary"
                          size="lg"
                          style={{ backgroundColor: "#34a343", border: "none" }}
                        >
                          Buy for {ethers.utils.formatEther(item.totalPrice)}{" "}
                          ETH
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

export default Marketplace;
