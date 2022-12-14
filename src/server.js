/* * ************************************************************ 
 * Date: 14-Dec-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file server.js 
 * *************************************************************** */

// This RPC server will announce itself as `rpc_test`
// in our Grape Bittorrent network
// When it receives requests, it will answer with 'world'

'use strict';

const { PeerRPCServer }  = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

const { Order } = require("./lib/Order");
const { Orderbook } = require("./lib/Orderbook");

var serverbook = new Orderbook();

const link = new Link({
  grape: 'http://127.0.0.1:30001'
});
link.start();

const peer = new PeerRPCServer(link, {
  timeout: 300000
});
peer.init();

const port = 1024 + Math.floor(Math.random() * 1000);
const service = peer.transport('server');
service.listen(port);


const announcers = {
    test : function(){
        link.announce('rpc_test', service.port, {});
    },
    orderMatched : function(order){
        link.announce("order-matched",service.port,order);
    }
};

setInterval(announcers.test, 1000);

service.on('request', (rid, key, payload, handler) => {
    console.log(payload); //  { msg: 'hello' }
    handler.reply(null, { msg: 'world' });
});

service.on("order-placed",(rid, key, payload, handler) => {
    var order = new Order(payload);
    serverbook.orderPlaced(order);
    handler.reply(null, { ok : true });
    order.on("matched", function(){
        announcers.orderMatched(order);
    });
    serverbook.matchOrder(order);
});

service.on("order-cancelled",(rid, key, payload, handler) => {
    serverbook.removeOrderCancelled(payload.id);
});
