// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@solmate/tokens/ERC20.sol";

contract DGRM is ERC20 {
    constructor() ERC20("Digram", "DGRM", 18) {
        this;
    }
}