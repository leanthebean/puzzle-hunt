App = {
    web3Provider: null,
    contracts: {},

    init: function () {

        $( ".action-button" ).each(function() {
            $(this).css("visibility", "visible");
        });

        $( ".loading" ).each(function() {
            $(this).hide();
        });

        return App.initWeb3();
    },

    initWeb3: function () {
        // Is there an injected web3 instance, e.g. Metamask?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('smart-contracts/build/contracts/NFTPrize.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            App.contracts.NFTPrize = TruffleContract(data);

            // Set the provider for our contract
            App.contracts.NFTPrize.setProvider(App.web3Provider);

            return App.getPrizeBalance();
        });
    },

    getPrizeBalance: async function () {

        let nftPrizeDiv = $('#nft-prize-view')
        let nftTemplate = $('#nft-prize-template');

        nftPrizeDiv.empty()

        web3.eth.getAccounts(async function(error, accounts) {
            if (error) {
                console.log(error);
                return;
            }
            var account = accounts[0];

            let contract = await App.contracts.NFTPrize.deployed()
            let userBalance = await contract.balanceOf(account, {
                from: account
            });

            for (i = 0; i < userBalance; i++) {
                let tokenId = await contract.tokenOfOwnerByIndex(account, i, {
                    from: account
                })

                let tokenImage = await contract.tokenURI(tokenId, {
                    from: account
                })

                nftTemplate.find('.token-id').text("token id: " + tokenId.toNumber())
                nftTemplate.find('.token-image').attr("src",tokenImage);
                    
                nftPrizeDiv.append(nftTemplate.html());
            }
        });
        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '#ten-action-button', App.handleSubmittingTenAnswer);
        $(document).on('click', '#magic-action-button', App.handleSubmittingMagicAnswer);
    },
    
    handleSubmittingTenAnswer: function () {
        let puzzleId = 0
        App.handleSubmittingAnswer('#ten-loading', '#ten-action-button', "#ten-proof-input", "#ten-verified", puzzleId, [1])
    },

    handleSubmittingMagicAnswer: function () {
        let puzzleId = 1
        App.handleSubmittingAnswer('#magic-loading', '#magic-action-button', "#magic-proof-input", "#magic-verified", puzzleId, [1])
    },

    handleSubmittingOtherAnswer: function () {
        let puzzleId = $('#other-puzzle-id').val().toNumber()
        console.log(puzzleId)
        App.handleSubmittingAnswer('#other-loading', '#other-action-button', "#other-proof-input", "#other-verified", puzzleId, [1])
    },

    handleSubmittingAnswer: function (loadingGif, actionButton, proofBox, verifiedSign, puzzleId, input) {
        
        web3.eth.getAccounts(async function (error, accounts) {
            let account = accounts[0];
            if (error) {
                console.log(error);
                return;
            }
            let contract = await App.contracts.NFTPrize.deployed()

            $(loadingGif).show();
            $(actionButton).css("visibility", "hidden");

            let proof = App.parseProofFromTextBox($(proofBox).val())

            debugger
                        
            let tx = await contract.mint(
                proof.A,
                proof.A_p,
                proof.B,
                proof.B_p,
                proof.C,
                proof.C_p,
                proof.H,
                proof.K,
                input,
                puzzleId,
                {
                    from: account,
                    gas: 2000000
                }
            );

            if(tx.logs[0]) { 
                $(verifiedSign).show();
                App.getPrizeBalance();
                $(loadingGif).hide();
            }
        })
    }, 

    parseProofFromTextBox: function(rawProof) { 
        let proof = rawProof.match(/0x[0-9A-F]+/ig)
        
        let A = [proof[0], proof[1]]
        let A_p = [proof[2], proof[3]]
        let B = [[proof[4], proof[5]], [proof[6], proof[7]]]
        let B_p = [proof[8], proof[9]]
        let C = [proof[10], proof[11]]
        let C_p = [proof[12], proof[13]]
        let H = [proof[14], proof[15]]
        let K = [proof[16], proof[17]]

        return { 
            'A': A,
            'A_p': A_p,
            'B': B,
            'B_p': B_p,
            'C': C,
            'C_p': C_p,
            'H': H,
            'K': K
        }
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});