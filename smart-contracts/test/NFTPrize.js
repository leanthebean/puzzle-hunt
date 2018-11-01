var NFTPrize = artifacts.require('NFTPrize')

var TenVerifier = artifacts.require('TenVerifier')
var MagicVerifier = artifacts.require('MagicVerifier')

contract('NFTPrize', accounts => { 

    let tokenImageForAddingTen = 'https://i.imgur.com/bHVMwAj.png'
    let tokenImageForMagicNumber = 'https://i.imgur.com/Ye7YFfX.png'

    beforeEach(async function () { 
        this.verifierContract = await TenVerifier.new({from: accounts[0]})
        this.magicVerifierContract = await MagicVerifier.new({from: accounts[0]})

        this.contract = await NFTPrize.new(this.verifierContract.address, {from: accounts[0]})

        await this.contract.addPuzzle(this.verifierContract.address, tokenImageForAddingTen)
        await this.contract.addPuzzle(this.magicVerifierContract.address, tokenImageForMagicNumber)
    })

    it('can add a new puzzle', async function () { 
        let verifierContract = await TenVerifier.new({from: accounts[0]})
        let tx = await this.contract.addPuzzle(verifierContract.address, 'test')

        assert.equal(tx.logs[0].event, 'PuzzleAdded')
        assert.equal(tx.logs[0].args.addr, verifierContract.address)
        assert.equal(tx.logs[0].args.tokenImage, 'test')
        assert.equal(new web3.BigNumber(tx.logs[0].args.puzzleId).toNumber(), 2)
    })

    it('mints a token if you got the answer right!', async function () {

        let proof = {
            "proof":
            {
                "A":["0x1d85e15a612f798991577f26bec8281409118727cd1ed8f829b3978a0e28048d", "0x28764947ddaf52e0441136fd422d38f4e715d035ac95f1104171bab10d40500c"],
                "A_p":["0x293597e0d4e761b95704b99fbe41cf0c6c56a3608c10c6b31fea23a0ed97b1a", "0x1e523eb72f285906493ca8fda1226dc0aa5dcffb9747aaab2363a17d796a1dbd"],
                "B":
                    [["0x22a409ccafb62270c2ba5ce2fb966cea5647dc8ba8ff722cd7587a0a034ae299", "0x2ac710d5f7c29ca21d0e4e523d9f19146dcdc94dcda4d1b95b4afd8dc943a7a"], ["0x1f364165e7b63db1d21f191e12d246f3b3b5ddf9a7520093d3116e9f93c3d75", "0x1358ce8542b8c21c6134ffc0e365a637305c72585245edc02c323638e2733a96"]],
                
                "B_p":["0x83c39894430bd1e0435fc861fd736512ab5e79fe8c1947ee484b865e2de846e", "0xd5196ced0c6e70614017f4c6200f5e24a2ac50868bacf2bb7a82317e825f3c"],
                "C":["0x2de5245c6d036d74269c6953f93fd7aef819d15b55bc3454a593c1805fcbf616", "0x1196e825cdfc3bc85e74d212b8b088dd0e94e588fb0236934ccb44e5b436936"],
                "C_p":["0x176a956446f9f78d52d1d1170e9116862225215e66fc79060a0b40e8af3aa4ba", "0x128e0755f23439054d3cecc5a1bc204cd6b1fc5148e1e2835974a05d82dd3791"],
                "H":["0x230a619bb05c54aa5505524e0ec29236f10ef06ce267ff45853be0d94267ac17", "0xd2a10294494b1afec1a7a1bc0dfd56f0eff5b95e899c8c4810309aa9a3fc20b"],
                "K":["0xfa286608a133fb27349e9ba8c7ca5d076a76946c165ca3bd69f53e800e62408", "0x19257bd009d9c11b4b829d766cf98ca4cd3755688df0b569bfe72d20ee47efb7"]
            },
            "input":[1]
        }

        let tx = await this.contract.mint(
            proof.proof.A, 
            proof.proof.A_p, 
            proof.proof.B, 
            proof.proof.B_p, 
            proof.proof.C, 
            proof.proof.C_p, 
            proof.proof.H, 
            proof.proof.K, 
            proof.input,
            0, 
        {from: accounts[1]})
    
        assert.equal(tx.logs[0].args.tokenId, 1)    
        assert.equal(await this.contract.ownerOf(1), accounts[1])
        assert.equal(await this.contract.tokenURI(1), tokenImageForAddingTen)
    })

    it('mints a token if you got the answer right!', async function () {

        let proof = {
            "proof":
            {
                "A":["0x1a9360ccd98f6d6ce0e9958d83196ee2f08a33f698bcfd3b9cb4178baa1ee556", "0x25db4af5af9b8392121284c716b17c6cc801d369f47b5ceff28ae3221ba8f617"],
                "A_p":["0x262f212854c159fda72bfec1e690cba826f13e242945c3501c1860bfbf7a1cf8", "0x2c81c8ce51b01806f0ac0b855a1ac56faac183fdbc1994ba3c61cc48e97408aa"],
                "B":
                    [["0x1909f796987105ad1efe345a6f80288664b992299e2badcb8e36d6fd7843460f", "0x183c9bc8a9b07f1d005530e09d40307150d1408605b240817f3f014b2b0c922d"], ["0x121dfc02e66f955be081fbb0b23cd59e38c4b69c6ad7eeb9551173d7a2cccc30", "0x81eaec6c58c458f375120feec1f0ccd00149aea7955842c474812e9f5497f1e"]],
                
                "B_p":["0x18238c1e2e48e4731820e03908dc593e95f76d12ce6c32ff6b7bd67cc3d44382", "0xc6c87902a3ed8c348963dcfaef40f33f5ea7d2b634a5ed5cdcacaac14b58e4f"],
                "C":["0xb229ee67f6d5b739c0f22aa970aab60170c2799694ea992d238f0bfc480dc0f", "0x16f35ef1f6333eba6cadddf383d6d2ad81fc186029a5f8615d6692e75b9dd39"],
                "C_p":["0xc64f421617c1c18affaa975c7d7632259c4afb7980d8b25e4574517eede0769", "0x1abdfd6d021a3e313fba0b40cc97a5709bdd12db31b708a9da8aded1ac9fa837"],
                "H":["0x2eb4d8b1bad1e9a2f215fafefaf8c1bf4c7987f0a394db048a5695e4a3874acf", "0x29cd9bcdf33731d4ba5c5ea74abcf2f961b12682cf4907dd3cdc66c335cd416c"],
                "K":["0x15710993ae81311bb359f94738eff034e9cc4f58ed784a231824f47aff4445e6", "0x1ec2a886f4e6c6d848e99649a7f44c0894baf071ea45045d96b80d63803876c5"]
            },
            "input":[1]
        }

        let tx = await this.contract.mint(
            proof.proof.A, 
            proof.proof.A_p, 
            proof.proof.B, 
            proof.proof.B_p, 
            proof.proof.C, 
            proof.proof.C_p, 
            proof.proof.H, 
            proof.proof.K, 
            proof.input,
            1, 
        {from: accounts[1]})
    
        assert.equal(tx.logs[0].args.tokenId, 1)    
        assert.equal(await this.contract.ownerOf(1), accounts[1])
        assert.equal(await this.contract.tokenURI(1), tokenImageForMagicNumber)
    })
})