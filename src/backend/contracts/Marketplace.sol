// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint256 public immutable feePercent; // the fee percentage on sales
    uint256 public itemCount;

    struct Item {
        uint256 itemId;
        IERC721 nft;
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool sold;
        address owner;
    }

    // itemId -> Item
    mapping(uint256 => Item) public items;

    event Offered(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );
    event Bought(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer,
        address owner
    );
    event PriceUpdated(uint256 itemId, uint256 price, address indexed seller);

    constructor(uint256 _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _price
    ) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false,
            msg.sender
        );
        // emit Offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function updatePrice(uint256 _itemId, uint256 _newPrice)
        external
        nonReentrant
    {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(!item.sold, "item already sold");
        require(_newPrice > 0, "Price must be greater than zero");
        require(item.owner == msg.sender, "Only item owner can relist");
        item.price = _newPrice;
        emit Offered(
            item.itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller
        );
    }

    function purchaseItem(uint256 _itemId) external payable nonReentrant {
        uint256 _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(
            msg.value >= _totalPrice,
            "not enough ether to cover item price and market fee"
        );
        require(!item.sold, "item already sold");

        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);

        // update item to sold
        item.sold = true;

        // transfer ownership to buyer
        item.owner = msg.sender;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender,
            item.owner
        );
    }

    // Relist an already listed item with a new price
    function relistItem(uint256 _itemId, uint256 _newPrice)
        external
        nonReentrant
    {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(item.sold, "Item not sold");
        require(_newPrice > 0, "Price must be greater than zero");
        require(item.owner == msg.sender, "Only item owner can relist");
        // Update item price
        item.price = _newPrice;
        // update item to sold
        item.sold = false;
        // transfer nft
        item.nft.transferFrom(msg.sender, address(this), item.tokenId);
        // Emit Offered event with new price
        emit Offered(
            _itemId,
            address(item.nft),
            item.tokenId,
            _newPrice,
            msg.sender
        );
    }

    function getTotalPrice(uint256 _itemId) public view returns (uint256) {
        return ((items[_itemId].price * (100 + feePercent)) / 100);
    }

    function isItemSold(uint256 _itemId) external view returns (bool) {
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        return items[_itemId].sold;
    }

    function getItemOwner(uint256 _itemId) external view returns (address) {
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        return items[_itemId].owner;
    }
}
