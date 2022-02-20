//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IWethMaker {
    event SetTrusted(address indexed user, bool isTrusted);

    function owner() external view returns (address);
}
