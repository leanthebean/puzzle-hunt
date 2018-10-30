let MagicVerifier = artifacts.require('MagicVerifier')

contract('MagicVerifier', accounts => { 
    beforeEach(async function() { 
        this.contract = await MagicVerifier.new({from: accounts[0]})
    })

    it('validator accepts correct proof', async function() { 
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

    it('validator does not accept the proof', async function() { 
        A = [1, 2]
        A_p = [1, 2]
        B = [[1, 2], [1, 2]]
        B_p = [1, 2]
        C = [1, 2]
        C_p = [1, 2]
        H = [1, 2]
        K = [1, 2]
        
        I = [1]

        let tx = await this.contract.verifyTx(A, A_p, B, B_p, C, C_p, H, K, I)
        assert.equal(tx.logs.length, 0)
    })
})