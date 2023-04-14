//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
contract WhiteList{
    uint8 maxWhiteListAddresses;
    mapping (address=>bool) public whiteListedAddress;
    uint8 public numAddressesWhitelisted;
    constructor(uint8 _maxWhiteListAddresses){
maxWhiteListAddresses=_maxWhiteListAddresses;
    }
    function addAddressToWhiteList()public{
        require(!whiteListedAddress[msg.sender],"user has been already whitelisted");
        require(numAddressesWhitelisted<maxWhiteListAddresses,"more addresses can not be whitelisted");
        whiteListedAddress[msg.sender]=true;
        numAddressesWhitelisted+=1;
    }
}