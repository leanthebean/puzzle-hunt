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
        assert.equal(new web3.BigNumber(tx.logs[0].args.puzzleId).toNumber(), 3)
    })

    it('mints a token if you got the answer right!', async function () {

        let proof = {
            "proof":
            {
                "A":["0x156b49825ec8e6707add754c855dc7622fcdb34b201d8f40330bba675ae262b4", "0x27bc8384bfc92ab40989043573a252cf8f0a3627b4c82d8ed7dae095b7f569b4"],
                "A_p":["0x72418cbe5fc6f19180d98889aee4b108378e609b50012dd492214b8f0c893ec", "0x69b5ebe100f8fb59e881d1c060d47038436d4bf68daa6153bf9c995afd82fc6"],
                "B":
                    [["0xf8cee8e3080be8f6ed405727934cff0679ff24ff0165e5d8dd41e4cae279e04", "0xf954cbb77549ed76161db8ce7dd93696f73a63cfa32ddd1baf8c346a62b42ca"], ["0x2b1cc8c2bb792609a06fdbd9b6c2c2986997a684315b1ae53576940e51f6e852", "0x1b00869eb552c622293ce2c1f84e353022d1b73f3c00659e5bd96d263f49cf7f"]],
                
                "B_p":["0x23315ce06bd6a5fa71ae8fd0ccdc222ccf796e006f21888c594ac56ac5d2b816", "0x2049831598234afeacca2a8e0c98aa6ab5b4a8ccbe157eb54d9d6097a8c7b0b4"],
                "C":["0x10db600dbb3e04d3321fed8716c2242b716a35e0cec69746186124973a66933d", "0x1c0271267d84b7dac114405a889dc6c3168693432383c3458caeb6806ade5d70"],
                "C_p":["0x1d16d35bb8fe689cf68464ebc360a4d3b47ecae2c3c53190379efee15cc404da", "0x10cc7833db65a877446c7fe8ea581fab772f16b0cc1bf1fa789181db3ab04df6"],
                "H":["0x117710b892e51132f3ad084ac169525d06eec09c8e9f05c2c582411e95074b41", "0x13f42bd6975d27755ea6ab6f34fa194bea0bc812762d521914986949a36674ec"],
                "K":["0x1263908bd874e2c285c61bffa656505f197599d1bb4384fa173946f826b09011", "0xac3db0945e610ead9984463bd21134e16f4fcfa86ada5253f9136fc575983f3"]
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
                "A":["0x267b0cab31f73b66e1a8f09ff186745f4c36fbf7c48b9218b37385a57a3f4cdf", "0x126427a05fee6103e45b1d6fa687ba9398d8f360f0eef73442b5acc6309ed517"],
                "A_p":["0x2f15a1d48ef3a26b9b9e4b4d06c16b54238c5a13230bf66421cf5e79aedf61c", "0x29895668ec13f4ead8b0ad149fb18d6f5db4fc2506ee1265207f94090a00c335"],
                "B":
                    [["0x89c88b3b259377131734ff20420a79d1d9e0315bb8f619a5e93d4c26357d758", "0x1271f9639fcdc081b2ec4caf663d436d53c157d0ee0a509756ee58ec51b72a71"], ["0x1308bdae25453786bd05460942ee730af8b05f808806a0456c26162e0cf6147b", "0x176772bd840995619a59f1c601af52580fd2b9b267248e2cd7a45bb8cfe3f423"]],
                
                "B_p":["0x1ce5ce9c2a9eec10bcfa936e517db77ab9dc6a3aa03c13a468f753c134a9747e", "0x1e7f6e0aa46d77e0f54129e98980daf3a77beb7e034f8e43457afbcdb0ad4684"],
                "C":["0x6f2b731528915dff314c5e40bb1e7b4868e3d14ddc4687b241c049b210346b", "0x2852dad4d459bc412bd5422767304aab28f45e20a3794d5548eeb253eace8f85"],
                "C_p":["0xe4c2459b8eb9cfecae275fb3ec300caa2ba7c06f93ddb8bcaa50202d6489b86", "0x1de62c8ecea0b267d2f1111b171f6625b3f609cf6d0d2a68a7fc6d443e100500"],
                "H":["0xed9fd578cce4add17cd550702293739e2ed9e3d9826bdeaf4af270cba9775cf", "0xfedd006493f40bf035506e7b1b8de181cb160ee3fc4481a7736e0318ecf2d69"],
                "K":["0x22633fef7110cb393a6208f21fc20ce0047124535397f66a19d93f056d71cb13", "0x161c88e4c10f8e64356c50960aafac7815417caf9676fe08496475a9f5a6a21e"]
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