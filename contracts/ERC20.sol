pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vaska is ERC20, AccessControl {

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  constructor() ERC20('Vaska', 'VSK') {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(ADMIN_ROLE, msg.sender);
    _setupRole(MINTER_ROLE, msg.sender);

    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
    mint(msg.sender, 10 * 10 ** 18);
  }

  /* function mint(address to, uint256 amount) public {
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
    _mint(to, amount);
  } */

  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE){
    _mint(to, amount);
  }
}
