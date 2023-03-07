import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import { Buffer } from "buffer";
import "../components/App.css";
import { useNavigate } from "react-router";
const ipfsClient = require("ipfs-http-client");

// IPFS authentication details
const IPFS_PROJECT_ID = process.env.REACT_APP_IPFS_PROJECT_ID;
const IPFS_PROJECT_SECRET = process.env.REACT_APP_IPFS_PROJECT_SECRET;
const IPFS_AUTH =
  "Basic " + Buffer.from(IPFS_PROJECT_ID + ":" + IPFS_PROJECT_SECRET).toString("base64");

// IPFS client configuration
const IPFS_CLIENT = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: IPFS_AUTH,
  },
});

const List = ({ nft, marketplace }) => {
  // Set the page title on component mount
  useEffect(async () => {
    document.title = "List";
  }, []);

  // Form state variables
  const [imageURL, setImageURL] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // File upload progress state variable
  const [uploadProgress, setUploadProgress] = useState(0);

  // Upload selected file to IPFS
  const uploadToIPFS = async (event) => {
    event.preventDefault();
    setUploadProgress(0);
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      const fileSize = file.size * 1024;
      const result = await IPFS_CLIENT.add(file);
      const buffer = await IPFS_CLIENT.add(file, {
        progress: (prog) => {
          const progressPercentage = (prog / fileSize) * 100;
          setUploadProgress(progressPercentage);
        },
      });
      setImageURL(`https://tokmart-nft.infura-ipfs.io/ipfs/${result.path}`);
    }
  };

  // Form validation state variable
  const [isFormValid, setIsFormValid] = useState(false);

  // Create NFT and list it for sale
  const createNFT = async () => {
    if (!imageURL || !price || !name || !description) {
      setIsFormValid(true);
    } else {
      try {
        const result = await IPFS_CLIENT.add(
          JSON.stringify({ image: imageURL, price, name, description })
        );
        mintThenList(result);
      } catch (error) {
        console.error("IPFS URI upload error: ", error);
      }
    }
  };

  const navigate = useNavigate();

  // Mint new NFT and list it for sale on marketplace
  const mintThenList = async (result) => {
    const uri = `https://tokmart-nft.infura-ipfs.io/ipfs/${result.path}`;
    await (await nft.mint(uri)).wait();
    const id = await nft.tokenCount();
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
    navigate("/marketplace", { replace: true });
  };
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />

              {uploadProgress > 0 && (
                <>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-inner"
                      style={{
                        width: `${uploadProgress * 1024}%`,
                      }}
                    />
                  </div>
                  <p className="text-center">
                    Uploading.... {uploadProgress.toFixed(2) * 1000}%
                  </p>
                </>
              )}

              {imageURL && (
                <img
                  style={{ width: "200px" }}
                  src={imageURL}
                  alt="Uploaded Image"
                />
              )}
              <Form.Control
                onChange={(e) => {
                  setName(e.target.value);
                  setIsFormValid(false);
                }}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsFormValid(false);
                }}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => {
                  setPrice(e.target.value);
                  setIsFormValid(false);
                }}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
              {isFormValid && (
                <p style={{ color: "red" }}>
                  Please fill all form fields. Thank you.
                </p>
              )}
              <div className="d-grid px-0">
                <Button
                  onClick={createNFT}
                  variant="primary"
                  size="lg"
                  style={{
                    backgroundColor: "#34a343",
                    border: "none",
                  }}
                >
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default List;
