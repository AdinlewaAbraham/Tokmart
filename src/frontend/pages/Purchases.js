import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import Loading from "../components/loading/Loading";

export default function MyPurchases({ marketplace, nft, account }) {
  useEffect(() => {
    document.title = "Purchases";
  }, []);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const loadPurchasedItems = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter = marketplace.filters.Bought(
      null,
      null,
      null,
      null,
      null,
      account
    );
    const results = await marketplace.queryFilter(filter);
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(
      results.map(async (i) => {
        // fetch arguments from each result
        i = i.args;
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId);
        // define listed item object
        let purchasedItem = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        };
        return purchasedItem;
      })
    );
    setLoading(false);
    setPurchases(purchases);
  };
  useEffect(() => {
    loadPurchasedItems();
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>
          <Loading />
        </h2>
      </main>
    );
  const relist = async (item) => {
    let price = 0.5;
    const id = await nft.tokenCount();
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.relistItem(id, listingPrice)).wait();
    console.log("relist suc");
  };
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
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
                      relist();
                    }}
                    type=""
                  >
                    relist
                  </button>
                </Card>
              </Col>
            ))}
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
