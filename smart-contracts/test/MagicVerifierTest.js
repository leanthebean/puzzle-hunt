let MagicVerifier = artifacts.require('MagicVerifier')

contract('MagicVerifier', accounts => { 
    beforeEach(async function() { 
        this.contract = await MagicVerifier.new({from: accounts[0]})
    })

    it('validator accepts correct proof', async function() { 
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