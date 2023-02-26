import React from "react";
import ImgCard from "./ImgCard";
import MetaMaskIcon from "../../../img/icons/MetaMask_Fox.svg";
import Mintimg from "../../../img/icons/nft-icon.svg";
import Upload from "../../../img/icons/nftcollection.svg";
import Happycustomer from "../../../img/icons/happy-svgrepo-com.svg";
const middleSection = () => {
  const Desc = (p) => {
    return (
      <div className="Desc">
        <div className="DescImgDiv">
          <img className="DescImg" src={p.img} alt="" loading="lazy" />
        </div>
        <div className="flexdivvv">
          <h2>{p.header}</h2>
          <p>{p.desc}</p>
        </div>
      </div>
    );
  };
  return (
    <div className="oneHunpx">
      <div className="description">
        <h1>Best Features for You</h1>
        <p>
          Experience the convenience and security of buying and selling NFT
          artworks with our cutting-edge platform.
        </p>
      </div>
      <div className="ImgCardWrapper">
        <ImgCard />
        <div className="DescDiv">
          <Desc
            img={MetaMaskIcon}
            header="metamusk pairing"
            desc="pair with metamusk and handle your transcation"
            color="lime"
          />
          <Desc
            img={Mintimg}
            header="Quick NFT transactions"
            desc=" We facilitate fast and efficient NFT transactions"
            color="lime"
          />
          <Desc
            img={Upload}
            header="Effortless Creation of NFTs"
            desc=" Easily mint NFTs with Tokmart.
            "
            color="lime"
          />
          <Desc
            img={Happycustomer}
            header="User-friendly interface"
            desc="our user-friendly interface is easy to navigate."
            color="lime"
          />
        </div>
      </div>
    </div>
  );
};

export default middleSection;
