import React from "react";
import "./Topsection.css";

import artdiff from "../../../img/artt.jpg";
import artone from "../../../img/anshita-nair-0rxLLHD1XxA-unsplash.webp";
import artthree from "../../../img/jonathan-borba-ipmc5-Z-uwQ-unsplash.jpg";
import artfour from "../../../img/lucas-gouvea-aoEwuEH7YAs-unsplash.jpg";
import artfive from "../../../img/8machine-_-9SS3n6hhMBY-unsplash.jpg";
import artsix from "../../../img/art.jpg";
import artseven from "../../../img/barbora-dostalova-yYuW_7uTOzY-unsplash.jpg";

import gifone from "../../../img/gif/giphy1.gif";
import giftwo from "../../../img/gif/giphy (2).gif";
import gifthree from "../../../img/gif/giphy (3).gif";
import { useNavigate } from "react-router-dom";

const NFTcard = (p) => {
  return (
    <div className="NFTcard">
      <img src={p.img} alt="" loading="lazy" />
    </div>
  );
};
const Linearcircle = (p) => {
  return (
    <div style={{ top: p.top, left: p.left }} className="Linearcircle"></div>
  );
};
const GlassImg = (p) => {
  return (
    <div style={{ left: p.left }} className="GlassImgDiv">
      <img src={p.img} alt="" loading="lazy" />
    </div>
  );
};

const Topsection = () => {
  const navigate = useNavigate();
  return (
    <div className="oneHunpx">
      <div className="rowMain">
        <div>
          <h1>
            Collect and sale your awesome{" "}
            <span style={{ color: "lime" }}> NFT's artwork</span>
          </h1>
          <p style={{ color: "grey" }}>
            Join the NFT revolution and become a part of the thriving digital
            art community. Discover a world of original and exclusive NFT
            artworks, hand-picked by our expert curators. Whether you're an art
            collector looking for your next big investment, or an artist
            searching for a platform to showcase your work, our marketplace
            offers a simple and seamless experience.
          </p>
          <button onClick={() => navigate("/marketplace")} className="button">
            Explore
          </button>{" "}
          <button onClick={() => navigate("/list")} className="button">
            Create
          </button>
        </div>
        <div className="roww">
          <div className="firstcol">
            <NFTcard img={artone} />
            <NFTcard img={artdiff} />
          </div>
          <div className="secondcol">
            <NFTcard img={artthree} />
            <NFTcard img={artfour} />
            <NFTcard img={artfive} />
          </div>
          <div className="thirdcol">
            <NFTcard img={artsix} />
            <NFTcard img={artseven} />
          </div>
        </div>
      </div>
      <div className="glassDivWrapper">
        <div className="glassDiv">
          <div className="LinearcircleTwo"></div>
          <Linearcircle left="50%" top="-150px" />
          <Linearcircle left="90%" top="-50%" />
          <div className="glassDivDesc">
            <h2>
              Get all famous <br /> advanced digital <br /> art
            </h2>
            <button onClick={() => navigate("/marketplace")} className="button">
              GO
            </button>
          </div>
        </div>
        <GlassImg left="5%" img={gifone} />
        <GlassImg left="25%" img={giftwo} />
        <GlassImg left="45%" img={gifthree} />
      </div>
    </div>
  );
};

export default Topsection;
