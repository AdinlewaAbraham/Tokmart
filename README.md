# Project Name

Tokmart

# Description
TokMart is a mobile-friendly NFT market app developed collaboratively by four experienced developers. The app is designed to provide users with a secure and easy way to buy and sell Non-Fungible Tokens (NFTs).

With TokMart, users only need to connect their wallet and start trading NFTs quickly and securely. Our app offers a comprehensive marketplace for users to find the perfect items to buy and sell. The platform also provides a safe and secure way to store NFTs in a private wallet.

TokMart features a variety of features that make it the ultimate destination for NFT trading. The app provides users with an intuitive and easy-to-navigate user interface that makes it easy to browse the marketplace and find what they are looking for. There are also advanced search options to help users narrow down search results.

## Table of Contents

- [Installation](#installation)
- [Contract Information](#contract-information)
- [Attribution](#attribution)
- [License](#license)

# important 
To use this project, you will need to have an Infura key stored in your .env file. If you don't have one already, you can easily create a free Infura account by visiting the Infura website and signing up. Once you have your Infura key, make sure to store it securely in your .env file. Please note that while Infura is free to use as long as you don't exceed your quota, you will be responsible for any fees if you go over the limits set by Infura.
## Installation

### Clone the repository
```
git clone https://github.com/AdinlewaAbraham/tokmart  
```

### cd into the Client Folder
```
cd tokmart
```

### Install the dependencies
```
npm install 
```
or 
```
yarn
```

### Run the deploy Script
```
npx hardhat run .\src\backend\scripts\deploy.js --network localhost
```

### Start the development server
```
npm start
```

### run on browser
```
http://localhost:3000
```

## setup metamusk
### localhost Network Setup
1. Open metamask and add network.
2. Network name `Localhost`
3. New RPC URL `http://127.0.0.1:8545`
4. Chain ID `31337`
5. Currency symbol `ETH`

### goerli network setup 
1. Open metamask and add network.
2. Network name `goerli`
3. New RPC URL `[http://127.0.0.1:8545](https://goerli.blockpi.network/v1/rpc/public)`
4. Chain ID `5`
5. Currency symbol `ETH`

## Contract-Information
The marketplace smart contract has been successfully deployed on the GOERLI TESTNET with the following address:

https://goerli.etherscan.io/address/0x73912E403BD86E8ad64023A38A0a918299bb2096

Contract address: 
```
0x73912E403BD86E8ad64023A38A0a918299bb2096
```

In addition, the nft smart contract has also been deployed on the GOERLI TESTNET with the following address:

https://goerli.etherscan.io/address/0xC6ce56bEb0b2F139D82Cf0340c6Ef9CE8a8765d2

Contract address:
```
0xC6ce56bEb0b2F139D82Cf0340c6Ef9CE8a8765d2
```

Thank you.

### Structs
#### MarketItem
- itemId (uint256): unique identifier for the market item
- nft (IERC721): the non-fungible token contract for the market item
- tokenId (uint256): the token id of the NFT
- price (uint256): the price of the market item in ether
- seller (address payable): the seller's address of the market item
- sold (bool): whether the market item has been sold or not
- owner (address): the current owner's address of the market item
### Mappings
#### items
- `Key`: uint256
- `Value`: MarketItem struct
### Variables
- `feeAccount (address payable)`: the account that receives fees
- `feePercent (uint256)`: the fee percentage on sales
- `itemCount (uint256)`: the total number of market items listed on the marketplace
### Events
- `Offered(uint256 itemId, address indexed nft, uint256 tokenId, uint256 price, address indexed seller)`: emitted when a market item is offered for sale
- `Bought(uint256 itemId, address indexed nft, uint256 tokenId, uint256 price, address indexed seller, address indexed buyer, address owner)`: emitted when a market item is bought
- `PriceUpdated(uint256 itemId, uint256 price, address indexed seller)`: emitted when the price of a market item is updated
### Functions
#### `makeItem(IERC721 _nft, uint256 _tokenId, uint256 _price) external nonReentrant`
- Creates a new market item on the marketplace with the given parameters
- Transfers the ownership of the NFT to the marketplace contract
- Emits an Offered event with the market item details
#### `updatePrice(uint256 _itemId, uint256 _newPrice) external nonReentrant`
- Updates the price of an existing market item with the given item ID
- Requires the caller to be the owner of the market item
- Emits a PriceUpdated event with the updated market item price
#### `purchaseItem(uint256 _itemId) external payable nonReentrant`
- Allows a user to purchase an existing market item with the given item ID
- Transfers the payment to the seller and the marketplace fee to the fee account
- Transfers the ownership of the NFT to the buyer
- Updates the sold and owner values of the market item
- Emits a Bought event with the market item details
#### `relistItem(uint256 _itemId, uint256 _newPrice) external nonReentrant`
- Relists an existing market item with a new price
- Requires the caller to be the owner of the market item and the item to be sold
- Transfers the ownership of the NFT to the marketplace contract
- Updates the price and sold values of the market item
- Emits an Offered event with the updated market item details
#### `getTotalPrice(uint256 _itemId) public view returns (uint256)`
- Calculates and returns the total price of an existing market item with the given item ID, including the marketplace fee
#### `isItemSold(uint256 _itemId) external view returns (bool)`
- Returns a boolean indicating whether an existing market item with the given item ID has been sold
- getItemOwner(uint256 _itemId) external view returns (address)
- Returns the address of the current owner of an existing market item with the given item ID.

## Attribution
The tokmart contract was derived from the source code available at (https://github.com/dappuniversity/nft_marketplace/tree/main/src/backend/contracts). The contract has been further optimized and enhanced with additional functions.

Please note that the original code was used as a basis for this contract, and appropriate attribution has been provided to the original source.

## License

This project is released under the MIT License.
