// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessControl {
    enum Role {
        None,
        Admin,
        Manufacturer,
        Distributor,
        Retailer,
        Customer
    }

    mapping(address => Role) private userRoles;
    address public owner;

    event RoleAssigned(address indexed user, Role role, address indexed assignedBy);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyRole(Role _role) {
        require(userRoles[msg.sender] == _role, "Insufficient permissions");
        _;
    }

    modifier hasRole(Role _role) {
        require(
            userRoles[msg.sender] == _role || msg.sender == owner,
            "Insufficient permissions"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        userRoles[msg.sender] = Role.Admin;
        emit RoleAssigned(msg.sender, Role.Admin, msg.sender);
    }

    function assignRole(address _user, Role _role) external onlyOwner {
        require(_user != address(0), "Invalid user address");
        require(_role != Role.None, "Cannot assign None role");
        userRoles[_user] = _role;
        emit RoleAssigned(_user, _role, msg.sender);
    }

    function getRole(address _user) external view returns (Role) {
        return userRoles[_user];
    }

    function hasPermission(address _user, Role _requiredRole) external view returns (bool) {
        return userRoles[_user] == _requiredRole || _user == owner;
    }

    function revokeRole(address _user) external onlyOwner {
        require(_user != owner, "Cannot revoke owner role");
        userRoles[_user] = Role.None;
        emit RoleAssigned(_user, Role.None, msg.sender);
    }
}
