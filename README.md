# ChainList DAPP

Decentralized app for course https://www.udemy.com/course/getting-started-with-ethereum-solidity-development/

## truffle Commands

1. Contracts deployment
    ```
    truffle migrate --network ganache
    ```

2. Enter truffle console
    ```javascript
    truffle console --network ganache
    ```

3. Obtain ChainList contract instance
    ```javascript
    ChainList.deployed().then(function(instance) {app = instance})
    ```

4. Get Article (state variables)
    ```javascript
    app.getArticle()
    ```

5. Sell article
    ```javascript
    app.sellArticle("test name", "test description", web3.toWei(3, "ether"), {from: web3.eth.accounts[1]})
    ```
## Truffle and Solidity versions

    Truffle v4.0.7 (core: 4.0.7)
    Solidity v0.4.19 (solc-js)
