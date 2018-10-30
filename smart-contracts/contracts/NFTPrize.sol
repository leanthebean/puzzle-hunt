pragma solidity ^0.4.24; 

import 'openzeppelin-solidity/contracts/token/erc721/ERC721Enumerable.sol';
import 'openzeppelin-solidity/contracts/token/erc721/ERC721Metadata.sol';

contract NFTPrize is ERC721Enumerable, ERC721Metadata("MagicCoin", "MAG") { 
    address public verifierContractAddToTen;
    address public verifierMagicNumber;

    struct Puzzle {
        uint index;
        address addr;
        string tokenImage;
    }

    Puzzle[] public puzzles;

    mapping(uint => bool) tokenUniqueness;

    event PuzzleAdded(address addr, string tokenImage, uint puzzleId);

    function addPuzzle(address _addr, string _tokenImage) public { 
        uint tokenId = puzzles.length;
        Puzzle memory puzzle = Puzzle(tokenId, _addr, _tokenImage);
        puzzles.push(puzzle);
        emit PuzzleAdded(_addr, _tokenImage, tokenId);
    }

    function mint(
        uint[2] a,
        uint[2] a_p,
        uint[2][2] b,
        uint[2] b_p,
        uint[2] c,
        uint[2] c_p,
        uint[2] h,
        uint[2] k,
        uint[1] input, 
        uint puzzleIndex
    ) public returns(bool) { 
        require(tokenUniqueness[a[0]] == false, "this answer was already previously submitted");

        bool result = Verifier(puzzles[puzzleIndex].addr).verifyTx(a, a_p, b, b_p, c, c_p, h, k, input);
        require(result, "incorrect proof");

        uint tokenId = ERC721Enumerable.totalSupply() + 1;
        ERC721Enumerable._mint(msg.sender, tokenId);
        ERC721Metadata._setTokenURI(tokenId, puzzles[puzzleIndex].tokenImage);
        tokenUniqueness[a[0]] = true;
    }
}

contract Verifier { 
    function verifyTx(
            uint[2] a,
            uint[2] a_p,
            uint[2][2] b,
            uint[2] b_p,
            uint[2] c,
            uint[2] c_p,
            uint[2] h,
            uint[2] k,
            uint[1] input
        ) public returns (bool r); 
}