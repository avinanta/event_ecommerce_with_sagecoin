This is a classroom hands-on project to learn Ethereum development. It features a Event e-commerce use-use with a ERC20 compliant coin (SageCoin SGC).

To download the source codes
1. git clone https://github.com/CTTeo/event_ecommerce_with_sagecoin.git
  - this will create a folder event_ecommerce_with_sagecoin and download all the source files
2. run "npm install"
  - this will install the dependency nodeJS modules

To run the code
1. At commandline, runs starttestrpc.sh (Linux/Mac) or starttestrpc.balanceTokens
2. open another commandline window, to deploy the smart-contracts runs these commands
  - "truffle compile --all"
    --> this will recompile every source file.
    --> You need to use this to force recompilation if you are change parent contract, truffle / solidity compiler doesn't detect the code dependency correctly and it will result in child class not inheriting the latest codebase.

  - "truffle migrate --reset"
    - this will trigger "normal" compilation if required, then it will deploy the contracts to the Ethereum node.
    - The "--reset" option ensures the contract addresses are updated in the JSON files (located in build folder). You need them to be up-to-date so that truffle console or geth will work properly.

  - "truffle test test/test/EventSaleHappyFlow.js"
    - this is the main test suite. I'm using BDD for Truffle test (variant of Mocha).
    - Most of the test cases are in this js files


TODOs
1. Complete the test case development, especially Exception flow
2. Modify the SageCoin to be ERC20 compliant - this should be easy
3. Develop the Web UI
