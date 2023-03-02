import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import ".././components/home/topSection/Topsection.css";

const Navigation = ({ web3Handler, account }) => {
  return (
    <Navbar expand="lg" className="navbar-dark bg-dark">
      <Container>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className="navbar-toggler"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav.Link as={Link} to="/" className="nav-link logo">
              Tok <span>mart</span>
            </Nav.Link>
          <Nav className="me-auto navbar-nav marginAuto">
            <Nav.Link as={Link} to="/marketplace" className="nav-link">
              marketplace
            </Nav.Link>
            <Nav.Link as={Link} to="/list" className="nav-link">
              list
            </Nav.Link>
            <Nav.Link as={Link} to="/listings" className="nav-link">
            listings
            </Nav.Link>
            <Nav.Link as={Link} to="/sold" className="nav-link">
            sold
            </Nav.Link>
            <Nav.Link as={Link} to="/purchases" className="nav-link">
            purchases
            </Nav.Link>
          </Nav>
          <Nav className="navbar-nav">
            {account ? (
              <Nav.Link
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                {account.slice(0, 5) + "..." + account.slice(38, 42)}
              </Nav.Link>
            ) : (
              <button onClick={web3Handler} className="btn btn-outline-light">
                Connect Wallet
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
