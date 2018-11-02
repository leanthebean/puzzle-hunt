# Read me

## Install Zokrates with Docker

Start this as soon as possible - this might take a couple minutes:

1. Install Docker   
* For mac: https://docs.docker.com/docker-for-mac/install/
* For windows: https://docs.docker.com/docker-for-windows/install/ 
* For linux: https://docs.docker.com/install/linux/docker-ce/ubuntu/ 

2. Run a docker container to get Zokrates v0.3.0     
First we'll create a working directory. Create an empty folder somewhere on your machine. 
```
cd <working directory>
mkdir <folder>
```

Next, we'll run a docker container with the Zokrates v0.3.0 image, and give it a volume which is that folder you created so files can sync from your host machine to to the `/home/zokrates/code` directory in your docker container. This might take a few minutes as it needs a lot to download to create your container.  
```
docker run -v <path for your folder>:/home/zokrates/code -ti zokrates/zokrates:0.3.0 /bin/bash 
```

EXAMPLE: `docker run -v ~/Documents/Code/puzzle-hunt:/home/zokrates/code -ti zokrates/zokrates:0.3.0 /bin/bash`

## Installation Prerequisites 
Need to have Node v8 and higher (with npm)

We'll test our smart contracts with truffle, so go ahead and make sure you have it:
```
npm install -g truffle
```

We'll also be using ganache-cli to test locally, so go ahead and get that too: 

```
npm install -g ganache-cli
```

Optionally, if you want to host the front end on localhost, you'll need http-server. Otherwise you can use the hosted version on Heroku (https://zkp-nft-puzzle-hunt.herokuapp.com/)
```
 npm install http-server -g
```

## Intro to Zokrates: What is it

[Zokrates](https://github.com/Zokrates/ZoKrates) is an amazing project that provides a DSL (Domain Specific Language) which is a custom higher level language that translates your code into a zk-SNARK. It is a "tool box for zk-SNARKs on Ethereum" and will allow us to write functions such that the output can be verified on-chain. Zokrates has a dependency on libsnark, which is a C++ library released by the authors of zk-SNARKs and requires a lot of dependencies that are os-specific, hence why it's built inside a docker container.

The Zokrates DSL is fairly intuitive, and we'll walk through some examples to get a sense of the syntax. 


## First Puzzle

### Create the puzzle

The first puzzle we'll create with Zokrates is: <b>What x and y add up to x * y + 4 == 10 ? </b>

(This is the exact example from the slides)

1. Open up the folder you created in your favorite editor, and make a new file `addToTen.code` 

    This program will verify inputs to determine whether or not they really do add up to 10. This program will be translated into an arithmetic circuit with constrains to generate a proof. This verifier program is public and necessary for someone to generate a proof, so you cannot give away the answer to the question in the verification process. 

    This is the code: 

    ```
    def main(private field x, private field y) -> (field):
        x * y + 4 == 10
        return 1
    ```

2. Now we'll have to compile our program. Go back to your docker container, and navigate to the folder we synced. We'll then use the zokrates CLI to compile:

    ```
    cd code
    ~/zokrates compile -i addToTen.code
    ```

    You should see your code being "flattened" like we went over in our example from the slides 

3. Now that we have our circuit, we need our "trusted setup" 
    ```
    ~/zokrates setup
    ```

    Note - you will need a new setup for every new circuit you make. So if you change your code, you'll have to run this command again. 

4. Next, we need to compute our "witness" that knows the answer to the puzzle 

    ```
    ~/zokrates compute-witness -a 2 3
    ```

    Notice there's a 'witness' file created now that has the steps of the computation. 

5. Now we're ready to generate our proof based on our witness. 

    ```
    ~/zokrates generate-proof
    ```

    Notice that this gives you evaluations of your polynomials such that A * B - C = H * K evaluated on some encrypted point, (with some other values corresponding to the blinding factors of A, B, and C). 

6. We're ready to generate our Verifier smart contract! 
    ```
    ~/zokrates export-verifier
    ```

    Notice that this generated a verifier.sol contract. Let's go ahead and rename it to something we can identify later, like TenVerifier.sol (you'll have to change the contract name also on line 144)

### Write some tests! 

Let's see if this actually works and learn how to use it through tests. 

Create a new directory in your folder, cd into it, and initialize truffle:
```
mkdir smart-contracts
cd smart-contracts
truffle init
``` 

Truffle created for us 3 directories: contracts, tests, and migrations. Go ahead and move TenVerifier.sol into the contracts folder. 

Make a new file in the tests directory `TenVerifierTest.js` 

Go ahead and open it in your editor, and let's write some tests: 

Truffle has a great mocha test framework integration. First, we'll grab our truffle artifact that represents our TenVerifier contract, use the 10 test accounts that come with the local test Ethereum network (ganache), and initialize our contract: 

```
let TenVerifier = artifacts.require('TenVerifier')

contract('TenVerifier', accounts => { 
    beforeEach(async function () { 
        this.contract = await TenVerifier.new({from: accounts[0]})
    })
})
```

Great! Now we're ready for our test. Let's look at the TenVerifier.sol contract. It only has one public function that we need to test, `verifyTx` which requires the outputs of the proof, and an array of public inputs (which is an array of at least one element even if there are no public inputs: `[1]`)

When we generated the proof, there was a proof.json file created that we can use. Notice in the TenVerifier.sol contract, if the proof passes, there is an event emitted. Let's use that in our tests. (Replace the proof object with the one you have in proof.json):

```
    it('passes for right values', async function () { 

        let proof = <copy paste all the contents from proof.json here>

        let tx = await this.contract.verifyTx(
            proof.proof.A, 
            proof.proof.A_p, 
            proof.proof.B, 
            proof.proof.B_p, 
            proof.proof.C, 
            proof.proof.C_p, 
            proof.proof.H, 
            proof.proof.K, 
            proof.input
        )
    
        assert.equal(tx.logs[0].event, 'Verified')
    })
```

Let's see if it worked! In your terminal, in the `smart-contracts` directory, run `truffle test` and it should pass. 

Obviously we want to also test the opposite case, when the proof doesn't work out: 

```
    it('passes for right values', async function () { 
        A = [1, 2]
        A_p = [1, 2]
        B = [[1, 2], [1, 2]]
        B_p = [1, 2]
        C = [1, 2]
        C_p = [1, 2]
        H = [1, 2]
        K = [1, 2]
        
        I = [4, 1]

        let tx = await this.contract.verifyTx(A, A_p, B, B_p, C, C_p, H, K, I)
        assert.equal(tx.logs.length, 0)
    })
```

Great! Now we have a way to interact with our Verifier smart contract. 

### NFT contract that gives a prize if the proof is correct 

Let's quickly create an NFT contract that issues tokens if the proof is accepted by the Verifier contract. 

To do this quickly, we'll use Zeppelin!!! :D <3

In your terminal, in the `smart-contracts/` directory, initialize npm so we can get openzeppelin

```
npm init -y 
npm install --save openzeppelin-solidity
```

Great, now in your `contracts/` directory, create a new file called `NFTPrize.sol` 

It'll be an ERC-721 NFT contract that is both Enumerable and has Metadata (this is so we can enumerate through NFTs that a user might own, and that the NFTs will have a URL where we can store an image). 

```
pragma solidity ^0.4.24; 

import 'openzeppelin-solidity/contracts/token/erc721/ERC721Enumerable.sol';
import 'openzeppelin-solidity/contracts/token/erc721/ERC721Metadata.sol';

contract NFTPrize is ERC721Enumerable, ERC721Metadata("MagicCoin", "MAG") { 

}
``` 

Inside the contract, let's create a mint function that only mints if the proof that was given is correct: 

```
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

        bool result = Verifier(<VERIFIER ADDRESS>).verifyTx(a, a_p, b, b_p, c, c_p, h, k, input);
        require(result, "incorrect proof");

        uint tokenId = ERC721Enumerable.totalSupply() + 1;
        ERC721Enumerable._mint(msg.sender, tokenId);
        ERC721Metadata._setTokenURI(tokenId, <TOKEN IMAGE URL>);
        tokenUniqueness[a[0]] = true;
    }
```

Since we're doing an external here to our Verifier contract that is presumably already deployed, we need an interface for it so our ABI compiles correctly. See the [full code example](https://github.com/leanthebean/puzzle-hunt/blob/master/smart-contracts/contracts/NFTPrize.sol#L53).

And of course, we should have tests for our NFT contract as well :) 

See the full implementation for it [here](https://github.com/leanthebean/puzzle-hunt/blob/master/smart-contracts/contracts/NFTPrize.sol) along with [tests](https://github.com/leanthebean/puzzle-hunt/blob/master/smart-contracts/test/NFTPrize.js). 


## Second Puzzle!

The first puzzle isn't interesting enough. I highly recommend checking out some [examples](https://github.com/Zokrates/ZoKrates/tree/develop/zokrates_cli/examples) from the Zokrates repo, especially the [sudoku](https://github.com/Zokrates/ZoKrates/blob/develop/zokrates_cli/examples/sudokuchecker.code) one. 

1. Open up the original folder you created in your favorite editor, and make a new file `magicNumber.code` 

    This will be for the puzzle:
    ![](https://i.imgur.com/SjBnBN7.png)


    The verification for it is pretty simple:
    ```
    def main(private field a, private field b, private field c, private field d, private field e) -> (field):
        field left = a * 10000 + b * 1000 + c * 100 + d * 10 + e
        field right = e * 10000 + d * 1000 + c * 100 + b * 10 + a

        left * 4 == right 

        return 1
    ```

2. Now we'll have to compile our program. Go back to your docker container, and navigate to the folder we synced. We'll then use the zokrates CLI to compile:

    ```
    cd code
    ~/zokrates compile -i magicNumber.code
    ```

    You should see your code being "flattened" like we went over in our example from the slides 

3. Now that we have our circuit, we need our "trusted setup" 
    ```
    ~/zokrates setup
    ```

    Note - you will need a new setup for every new circuit you make. So if you change your code, you'll have to run this command again. 

4. Next, we need to compute our "witness" that knows the answer to the puzzle 

    ```
    ~/zokrates compute-witness -a <mwahahahaha you'll have to figure out the answer>
    ```

5. Generate proof:

    ```
    ~/zokrates generate-proof
    ```

6. Generate our Verifier smart contract! 
    ```
    ~/zokrates export-verifier
    ```

    Rename it to MagicVerifier.sol (and rename the contract title on line 144) and move it to smart-contracts/contracts

On your own, try to write some tests for it, and see how to include it in our NFTPrize contract! (If you get stuck, see the full implementation in this repo)

## How to make this entire demo work locally

```
git clone git@github.com:leanthebean/puzzle-hunt.git
```

1. [Install Zokrates](#Install-Zokrates-with-Docker) and use the directory of where you cloned this repo for the `-v` flag, e.g. the last step would be: `docker run -v <path for this repo locally>:/home/zokrates/code -ti zokrates/zokrates:0.3.0 /bin/bash `

2. Follow the steps to compile, setup, compute-witness, generate-proof, and export-verifier. 

3. Then install the [Ethereum dependencies](#Installation-Prerequisites), and go into the `smart-contracts` directory and run `npm install` 

4. In a separate terminal window, run `ganache-cli` to start your local version of Ethereum. Copy the mnemonic. 

5. In the `smart-contracts/` directory run "truffle migrate". (Check out the migration scripts for how to link contracts from the start)

6. Go back to top folder, and run `http-server`, and navigate to `localhost:8080` in your (chrome or brave) browser. 

7. Install Metamask if you don't have it already. Use the seed mnemonic you copied in step 4 to "import using account seed phrase" in Metamask. 

8. Now copy over the entire proof from the terminal when you generated the proof into the appropriate textbox, click submit, and see if you got it right by getting an NFT! Whoo!~ 


Note: you'll have to re-generate the verification contracts since you need the verification keys to generate new proofs. 

![](https://im6.ezgif.com/tmp/ezgif-6-733943349c30.gif)