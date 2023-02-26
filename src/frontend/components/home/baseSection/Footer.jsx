import React from "react";
import "./BaseSection.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div>
        <h1>TokMart</h1>
        <p>
          NFT marketplace for buying and selling uniquedigital assets, <br />{" "}
          powered by blockchain technologyand accessible through <br /> the
          DApp.
        </p>
      </div>
      <div>
        <ul>
          <h4>Company</h4>

          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/marketplace">Marketplace</Link>
          </li>
          <li>
            <Link to="/list">list</Link>
          </li>
          <li>
            <Link to="/listings">Listings</Link>
          </li>
          <li>
            <Link to="/purchases">Purchases</Link>
          </li>
        </ul>
      </div>
      <div>
        <ul>
          <h4>Developers</h4>
          <li>
            <a href="https://github.com/O-Abdullahi" target="_blank">
              Abdullahi Olaniyan
            </a>
          </li>
          <li>
            <a href="https://github.com/AdinlewaAbraham" target="_blank">
              Adinlewa Abraham
            </a>{" "}
          </li>
          <li>
            <a href="https://github.com/Issybobo" target="_blank">
              Israel Ogunsola
            </a>
          </li>
          <li>
            <a href="https://github.com/koolboy89" target="_blank">
              Kolade Odesanmi
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
