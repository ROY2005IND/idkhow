const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeriChain Supply - Smart Contracts", function () {
  let accessControl, productRegistry, supplyChainEvents;
  let owner, manufacturer, distributor, retailer, customer;

  beforeEach(async function () {
    [owner, manufacturer, distributor, retailer, customer] = await ethers.getSigners();

    const AccessControl = await ethers.getContractFactory("AccessControl");
    accessControl = await AccessControl.deploy();
    await accessControl.waitForDeployment();

    const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
    productRegistry = await ProductRegistry.deploy(await accessControl.getAddress());
    await productRegistry.waitForDeployment();

    const SupplyChainEvents = await ethers.getContractFactory("SupplyChainEvents");
    supplyChainEvents = await SupplyChainEvents.deploy(
      await accessControl.getAddress(),
      await productRegistry.getAddress()
    );
    await supplyChainEvents.waitForDeployment();
  });

  describe("AccessControl", function () {
    it("Should set the deployer as owner with Admin role", async function () {
      expect(await accessControl.owner()).to.equal(owner.address);
      expect(await accessControl.getRole(owner.address)).to.equal(1);
    });

    it("Should allow owner to assign roles", async function () {
      await accessControl.assignRole(manufacturer.address, 2);
      expect(await accessControl.getRole(manufacturer.address)).to.equal(2);
    });

    it("Should emit RoleAssigned event", async function () {
      await expect(accessControl.assignRole(manufacturer.address, 2))
        .to.emit(accessControl, "RoleAssigned")
        .withArgs(manufacturer.address, 2, owner.address);
    });

    it("Should not allow non-owner to assign roles", async function () {
      await expect(
        accessControl.connect(manufacturer).assignRole(distributor.address, 3)
      ).to.be.revertedWith("Only owner can perform this action");
    });

    it("Should allow owner to revoke roles", async function () {
      await accessControl.assignRole(manufacturer.address, 2);
      await accessControl.revokeRole(manufacturer.address);
      expect(await accessControl.getRole(manufacturer.address)).to.equal(0);
    });
  });

  describe("ProductRegistry", function () {
    beforeEach(async function () {
      await accessControl.assignRole(manufacturer.address, 2);
    });

    it("Should allow manufacturer to register a product", async function () {
      await expect(
        productRegistry.connect(manufacturer).registerProduct(
          "Laptop",
          "BATCH-001",
          "High-end gaming laptop",
          "Electronics"
        )
      ).to.emit(productRegistry, "ProductCreated");
    });

    it("Should increment product counter correctly", async function () {
      await productRegistry.connect(manufacturer).registerProduct(
        "Laptop",
        "BATCH-001",
        "High-end gaming laptop",
        "Electronics"
      );
      expect(await productRegistry.getTotalProducts()).to.equal(1);
    });

    it("Should retrieve product details correctly", async function () {
      await productRegistry.connect(manufacturer).registerProduct(
        "Laptop",
        "BATCH-001",
        "High-end gaming laptop",
        "Electronics"
      );

      const product = await productRegistry.getProduct(1);
      expect(product.name).to.equal("Laptop");
      expect(product.batchNumber).to.equal("BATCH-001");
      expect(product.manufacturer).to.equal(manufacturer.address);
      expect(product.exists).to.be.true;
    });

    it("Should not allow non-manufacturer to register products", async function () {
      await expect(
        productRegistry.connect(customer).registerProduct(
          "Laptop",
          "BATCH-001",
          "Description",
          "Electronics"
        )
      ).to.be.revertedWith("Only manufacturers can register products");
    });

    it("Should track products by manufacturer", async function () {
      await productRegistry.connect(manufacturer).registerProduct(
        "Laptop",
        "BATCH-001",
        "Description",
        "Electronics"
      );
      await productRegistry.connect(manufacturer).registerProduct(
        "Phone",
        "BATCH-002",
        "Description",
        "Electronics"
      );

      const products = await productRegistry.getProductsByManufacturer(manufacturer.address);
      expect(products.length).to.equal(2);
    });
  });

  describe("SupplyChainEvents", function () {
    beforeEach(async function () {
      await accessControl.assignRole(manufacturer.address, 2);
      await accessControl.assignRole(distributor.address, 3);
      await accessControl.assignRole(retailer.address, 4);

      await productRegistry.connect(manufacturer).registerProduct(
        "Laptop",
        "BATCH-001",
        "High-end gaming laptop",
        "Electronics"
      );
    });

    it("Should allow authorized users to add events", async function () {
      await expect(
        supplyChainEvents.connect(manufacturer).addEvent(
          1,
          0,
          "Factory - Mumbai",
          "Product manufactured"
        )
      ).to.emit(supplyChainEvents, "SupplyChainEventAdded");
    });

    it("Should retrieve product history correctly", async function () {
      await supplyChainEvents.connect(manufacturer).addEvent(
        1,
        0,
        "Factory - Mumbai",
        "Manufactured"
      );
      await supplyChainEvents.connect(distributor).addEvent(
        1,
        1,
        "Warehouse - Delhi",
        "Received at warehouse"
      );

      const history = await supplyChainEvents.getProductHistory(1);
      expect(history.length).to.equal(2);
      expect(history[0].location).to.equal("Factory - Mumbai");
      expect(history[1].location).to.equal("Warehouse - Delhi");
    });

    it("Should not allow unauthorized users to add events", async function () {
      await expect(
        supplyChainEvents.connect(customer).addEvent(
          1,
          0,
          "Location",
          "Notes"
        )
      ).to.be.revertedWith("Unauthorized to add events");
    });

    it("Should not allow events for non-existent products", async function () {
      await expect(
        supplyChainEvents.connect(manufacturer).addEvent(
          999,
          0,
          "Location",
          "Notes"
        )
      ).to.be.revertedWith("Product does not exist");
    });

    it("Should track total events count", async function () {
      await supplyChainEvents.connect(manufacturer).addEvent(
        1,
        0,
        "Location 1",
        "Event 1"
      );
      await supplyChainEvents.connect(distributor).addEvent(
        1,
        1,
        "Location 2",
        "Event 2"
      );

      expect(await supplyChainEvents.getTotalEvents()).to.equal(2);
    });
  });
});
