// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";
import "./ProductRegistry.sol";

contract SupplyChainEvents {
    enum EventType {
        Manufacturing,
        Warehouse,
        Shipping,
        Retail,
        Customer
    }

    struct Event {
        uint256 eventId;
        uint256 productId;
        EventType eventType;
        string location;
        uint256 timestamp;
        address actor;
        string notes;
    }

    AccessControl public accessControl;
    ProductRegistry public productRegistry;
    uint256 private eventCounter;

    mapping(uint256 => Event) private events;
    mapping(uint256 => uint256[]) private productEvents;

    event SupplyChainEventAdded(
        uint256 indexed eventId,
        uint256 indexed productId,
        EventType eventType,
        string location,
        address indexed actor,
        uint256 timestamp
    );

    modifier onlyAuthorized() {
        AccessControl.Role role = accessControl.getRole(msg.sender);
        require(
            role == AccessControl.Role.Admin ||
            role == AccessControl.Role.Manufacturer ||
            role == AccessControl.Role.Distributor ||
            role == AccessControl.Role.Retailer,
            "Unauthorized to add events"
        );
        _;
    }

    constructor(address _accessControlAddress, address _productRegistryAddress) {
        require(_accessControlAddress != address(0), "Invalid access control address");
        require(_productRegistryAddress != address(0), "Invalid product registry address");
        
        accessControl = AccessControl(_accessControlAddress);
        productRegistry = ProductRegistry(_productRegistryAddress);
        eventCounter = 0;
    }

    function addEvent(
        uint256 _productId,
        EventType _eventType,
        string memory _location,
        string memory _notes
    ) external onlyAuthorized returns (uint256) {
        require(productRegistry.productExists(_productId), "Product does not exist");
        require(bytes(_location).length > 0, "Location cannot be empty");

        eventCounter++;
        uint256 newEventId = eventCounter;

        events[newEventId] = Event({
            eventId: newEventId,
            productId: _productId,
            eventType: _eventType,
            location: _location,
            timestamp: block.timestamp,
            actor: msg.sender,
            notes: _notes
        });

        productEvents[_productId].push(newEventId);

        emit SupplyChainEventAdded(
            newEventId,
            _productId,
            _eventType,
            _location,
            msg.sender,
            block.timestamp
        );

        return newEventId;
    }

    function getProductHistory(uint256 _productId) external view returns (Event[] memory) {
        require(productRegistry.productExists(_productId), "Product does not exist");
        
        uint256[] memory eventIds = productEvents[_productId];
        Event[] memory history = new Event[](eventIds.length);

        for (uint256 i = 0; i < eventIds.length; i++) {
            history[i] = events[eventIds[i]];
        }

        return history;
    }

    function getEvent(uint256 _eventId) external view returns (
        uint256 eventId,
        uint256 productId,
        EventType eventType,
        string memory location,
        uint256 timestamp,
        address actor,
        string memory notes
    ) {
        require(_eventId > 0 && _eventId <= eventCounter, "Event does not exist");
        Event memory evt = events[_eventId];
        
        return (
            evt.eventId,
            evt.productId,
            evt.eventType,
            evt.location,
            evt.timestamp,
            evt.actor,
            evt.notes
        );
    }

    function getTotalEvents() external view returns (uint256) {
        return eventCounter;
    }

    function getProductEventCount(uint256 _productId) external view returns (uint256) {
        require(productRegistry.productExists(_productId), "Product does not exist");
        return productEvents[_productId].length;
    }
}
