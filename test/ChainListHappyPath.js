var ChainList = artifacts.require("./chainlist.sol");

contract("ChainList", function(accounts) {

    var chainListInstance;
    var seller = accounts[1];
    var name = "article 1";
    var description = "description 1";
    var price = 10;

    it("should be initialized with empty values", function() {
        return ChainList.deployed().then(function(instance) {
            return instance.getArticle();
        }).then(function(data) {
            assert.equal(data[0], 0x0, "seller must be empty");
            assert.equal(data[1], "", "name must be empty");
            assert.equal(data[2], "", "description must be empty");
            assert.equal(data[3].toNumber(), 0, "price must be empty");
        });
    });

    it("should sell an article", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(name, description, web3.toWei(price, "ether"), {from: seller});
        }).then(function() {
            return chainListInstance.getArticle();
        }).then(function(data) {
            assert.equal(data[0], seller, "seller must be " + seller);
            assert.equal(data[1], name, "name must be " + name);
            assert.equal(data[2], description, "description must be " + description);
            assert.equal(data[3].toNumber(), web3.toWei(price, "ether"), "price must be " + web3.toWei(price, "ether"));
        });
    });

    it("should trigger an event when a new article is sold", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(name, description, web3.toWei(price, "ether"), {from: seller});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "one event triggered");
            assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
            assert.equal(receipt.logs[0].args._seller, seller, "seller must be " + seller);
            assert.equal(receipt.logs[0].args._name, name, "name must be " + name);
            assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(price, "ether"), "price must be " + web3.toWei(price, "ether"));
        });
    });
});