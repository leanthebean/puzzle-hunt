var Verifier = artifacts.require('TenVerifier')

contract('Verifier', accounts => { 
    beforeEach(async function() { 
        this.contract = await Verifier.new({from: accounts[0]})
    })

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


    it('passes for right values', async function () { 

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
})