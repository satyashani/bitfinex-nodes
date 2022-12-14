/* * ************************************************************ 
 * Date: 14-Dec-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file client.js 
 * *************************************************************** */

'use strict';

const { PeerRPCClient }  = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

const { Order } = require("./lib/Order");
const { Orderbook } = require("./lib/Orderbook");
const enums = require("./lib/enums");

const link = new Link({
  grape: 'http://127.0.0.1:30001'
});
link.start();

const peer = new PeerRPCClient(link, {});
peer.init();

const handler = {
    test : function(){
        peer.request('rpc_test', { request: 'hello' }, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
            console.log(data);
        });
    },
    placeOrder : function(order){
        peer.request('rpc_test',{ request : "order-placed",  data : order}, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log(data);
        });
    },
    cancelOrder : function(order){
        peer.request('rpc_test',{ request : "order-cancelled", data : order }, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log(data);
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

var client = new Client();

client.testConnect();
setTimeout(function(){
    client.createOrder(100,100,enums.order.type.buy);
},2000);