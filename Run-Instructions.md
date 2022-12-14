## Instructions to test run

* Install grape - `npm i -g grenache-grape`
* Boot Grape Servers

```
# boot two grape servers

grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

* Start server - `cd ./src && node server.js`
* Run Client - `cd ./src && node client.js`
* To test multiple clients, create instance of client using ```js var client = new Client() ``` and call `client.placeOrder(<Qty>,<Price>,<Type>(Buy|Sell))


## Incomplete Parts

* Testing
* Better code re-arrangement
* Could not figure out how to propagate the information of matched orders to clients
* What is meant by "Remainer" in problem statement? I've added a `status` field to order and updated that on matching order.

