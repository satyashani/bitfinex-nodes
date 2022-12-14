/* * ************************************************************ 
 * Date: 14-Dec-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file client.js 
 * *************************************************************** */

// This client will as the DHT for a service called `rpc_test`
// and then establishes a P2P connection it.
// It will then send { msg: 'hello' } to the RPC server

'use strict';

const { PeerRPCClient }  = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

const { Order } = require("./lib/Order");
const { Orderbook } = require("./lib/Orderbook");

var clientbook = new Orderbook();

const link = new Link({
  grape: 'http://127.0.0.1:30001'
});
link.start();

const peer = new PeerRPCClient(link, {});
peer.init();

const handler = {
    test : function(){
        peer.request('rpc_test', { msg: 'hello' }, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
            console.log(data); // { msg: 'world' }
        });
    },
    placeOrder : function(order){
        peer.request('order-placed', order, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log(data); // { msg: 'world' }
        });
    },
    cancelOrder : function(order){
        peer.request('order-cancelled', order, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log(data); // { msg: 'world' }
        });
    }
};

class Client {
    orderbook = null;
    id = "";
    
    constructor (id){
        this.orderbook = new Orderbook();
        this.id = id || ("Client_" + Math.random() * 1000 );
    }
    
    testConnect (){
        handler.test();
    }
    
    createOrder (qty, price,type){
        var order = new Order({
            clientid : this.id,
            qty : qty,
            price : price,
            type : type
        });
        this.orderbook.placeOrder(order);
        handler.placeOrder(order);
        order.on("cancelled",function(){
            this.orderbook.removeOrderCancelled(order.id);
            handler.cancelOrder(order); 
        });
    }
    
    cancelOrder (orderid){
        for(var i=0;i<this.orderbook.length;i++){
            if(orderid === this.orderbook[i].id){
                this.orderbook[i].cancel();
            }
        }
    }
};

exports.Client = Client;