// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

contract ProductRegistry {
    struct Product {
        uint256 productId;
        string name;
        address manufacturer;
        uint256 createdAt;
        string batchNumber;
        bool exists;
        string description;
        string category;
    }

    AccessControl public accessControl;
    uint256 private productCounter;
    
    mapping(uint256 => Product) private products;
    mapping(address => uint256[]) private manufacturerProducts;

    event ProductCreated(
        uint256 indexed productId,
        string name,
        address indexed manufacturer,
        string batchNumber,
        uint256 timestamp
    );

    modifier onlyManufacturer() {
        require(
            accessControl.getRole(msg.sender) == AccessControl.Role.Manufacturer ||
            accessControl.getRole(msg.sender) == AccessControl.Role.Admin,
            "Only manufacturers can register products"
        );
        _;
    }

    constructor(address _accessControlAddress) {
        require(_accessControlAddress != address(0), "Invalid access control address");
        accessControl = AccessControl(_accessControlAddress);
        productCounter = 0;
    }

    function registerProduct(
        string memory _name,
        string memory _batchNumber,
        string memory _description,
        string memory _category
    ) external onlyManufacturer returns (uint256) {
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(bytes(_batchNumber).length > 0, "Batch number cannot be empty");

        productCounter++;
        uint256 newProductId = productCounter;

        products[newProductId] = Product({
            productId: newProductId,
            name: _name,
            manufacturer: msg.sender,
            createdAt: block.timestamp,
            batchNumber: _batchNumber,
            exists: true,
            description: _description,
            category: _category
        });

        manufacturerProducts[msg.sender].push(newProductId);

        emit ProductCreated(
            newProductId,
            _name,
            msg.sender,
            _batchNumber,
            block.timestamp
        );

        return newProductId;
    }

    function getProduct(uint256 _productId) external view returns (
        uint256 productId,
        string memory name,
        address manufacturer,
        uint256 createdAt,
        string memory batchNumber,
        bool exists,
        string memory description,
        string memory category
    ) {
        require(products[_productId].exists, "Product does not exist");
        Product memory product = products[_productId];
        
        return (
            product.productId,
            product.name,
            product.manufacturer,
            product.createdAt,
            product.batchNumber,
            product.exists,
            product.description,
            product.category
        );
    }

    function getProductsByManufacturer(address _manufacturer) external view returns (uint256[] memory) {
        return manufacturerProducts[_manufacturer];
    }

    function getTotalProducts() external view returns (uint256) {
        return productCounter;
    }

    function productExists(uint256 _productId) external view returns (bool) {
        return products[_productId].exists;
    }
}
