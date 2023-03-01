import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import { Buffer } from "buffer";
import "../components/App.css"

const ipfsClient = require("ipfs-http-client");
const projectId = process.env.REACT_APP_IPFS_PROJECT_ID;
const projectSecret = process.env.REACT_APP_IPFS_PROJECT_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const Create = ({ nft, marketplace }) => {
  useEffect( async() => {
    document.title = "List";
  }, []);
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [progress, setProgress] = useState(0);

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    setProgress(0);
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      const fileSize = file.size;
      console.log("File size:", fileSize);
      try {
        const buffer = await client.add(file, {
          progress: (prog) => {
            const progressPercentage = (prog / fileSize) * 100;
            setProgress(progressPercentage);
            console.log(progressPercentage);
          },
        });
        setImage(`https://tokmart-nft.infura-ipfs.io/ipfs/${buffer.path}`);
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };
  const [isformedfilled, setisformedfilled] = useState(false);
  const createNFT = async () => {
    if (!image || !price || !name || !description) {
      setisformedfilled(true);
      console.log(" rejected");
    } else {
      console.log("not rejected");
      try {
        const result = await client.add(
          JSON.stringify({ image, price, name, description })
        );
        mintThenList(result);
      } catch (error) {
        console.log("ipfs uri upload error: ", error);
      }
    }
  };
  const mintThenList = async (result) => {
    const uri = `https://tokmart-nft.infura-ipfs.io/ipfs/${result.path}`;
    await (await nft.mint(uri)).wait();
    const id = await nft.tokenCount();
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
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
             
                  {progress > 0 && (
                    <>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-inner"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                      <p>Uploading.... {progress.toFixed(2)}%</p>
                    </>
                  )}
                
              {image && (
                <img
                  style={{ width: "200px" }}
                  src={image}
                  alt="Uploaded Image"
                />
              )}
              <Form.Control
                onChange={(e) => {
                  setName(e.target.value);
                  setisformedfilled(false);
                }}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => {
                  setDescription(e.target.value);
                  setisformedfilled(false);
                }}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => {
                  setPrice(e.target.value);
                  setisformedfilled(false);
                }}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
              {isformedfilled && (
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

export default Create;
