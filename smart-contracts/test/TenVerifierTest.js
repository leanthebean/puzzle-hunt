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