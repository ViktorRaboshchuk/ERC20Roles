import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Vaska", function (){
  let erc20Token: ERC20;
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const ERC20Token = await hre.ethers.getContractFactory("Vaska", {signer: owner});
    erc20Token = await ERC20Token.deploy();
  });

  // describe("Check mint functionality", () => {
  //   it("check if msg.sender has MINTER_ROLE ", async function (){
  //     await expect(erc20Token.connect(addr1).mint(addr1.address, BigInt(10*10**18))).to.be.revertedWith('Caller is not a minter');
  //   });
  // });

  describe("Check mint functionality", () => {
    it("check if msg.sender has MINTER_ROLE ", async function (){
      let revert_string = "AccessControl: account " + ethers.utils.hexlify(addr1.address) + " is missing role " + ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'));
      await expect(erc20Token.connect(addr1).mint(addr1.address, BigInt(10*10**18))).to.be.revertedWith(revert_string);
    });
  });

   describe("Check hasRole functionality", () => {
     it("Chek owner has MINTER_ROLE", async function (){
       let role = await erc20Token.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), owner.address);
       await expect(role).to.equal(true);
     });

     it("Chek owner has ADMIN_ROLE", async function (){
       let role = await erc20Token.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_ROLE')), owner.address);
       await expect(role).to.equal(true);
     });


     it("Check addr1 failed to have MINTER_ROLE", async function (){
       let role = await erc20Token.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), addr1.address);
       await expect(role).to.equal(false);
     });

     it("Check addr1 failed to have ADMIN_ROLE", async function (){
       let role = await erc20Token.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_ROLE')), addr1.address);
       await expect(role).to.equal(false);
     });
   });

   describe("Check getRoleAdmin functionality", () => {
     it("Check that ADMIN_ROLE controls MINTER_ROLE", async function (){
       let role = await erc20Token.getRoleAdmin(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')));
       await expect(role).to.equal(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_ROLE')));
     });

     it("Check that DEFAULT_ADMIN_ROLE controls ADMIN_ROLE", async function (){
       let role = await erc20Token.getRoleAdmin(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_ROLE')));
       await expect(role).to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
     });

   });

   describe("Check grantRole functionality", () => {
     it("Owner grands MINTER_ROLE role to addr1", async function (){
       let role = await erc20Token.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), addr1.address);
       await expect(Boolean(role.value)).to.equal(true);
       let addr1role = await erc20Token.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), addr1.address);
       await expect(addr1role).to.equal(true);
     });
   });

   describe("Check revokeRole functionality", () => {
     it("Owner revoke MINTER_ROLE role from addr1", async function (){
       let role = await erc20Token.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), addr1.address);
       await expect(Boolean(role.value)).to.equal(true);

       let revoke = await erc20Token.revokeRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), addr1.address);
       await expect(Boolean(role.value)).to.equal(true);

       let addr1role = await erc20Token.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), addr1.address);
       await expect(addr1role).to.equal(false);

     });
   });

   describe("Check renounceRole functionality", () => {
     it("Owner renounce MINTER role", async function (){
       let role = await erc20Token.renounceRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), owner.address);
       await expect(Boolean(role.value)).to.equal(true);
       let addr1role = await erc20Token.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), owner.address);
       await expect(addr1role).to.equal(false);
     });

     it("Calling renounceRole from other account", async function (){
       await expect(erc20Token.renounceRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE')), addr1.address)).to.be.revertedWith('AccessControl: can only renounce roles for self');
     });
   });


});
