/* * ************************************************************ 
 * Date: 14-Dec-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file server.js 
 * *************************************************************** */

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

const handlers = {
    orderPlaced : function(data){
        var order = new Order(data);
        serverbook.orderPlaced(order);
        console.log("orderbook",serverbook.toString());
        order.on("matched", function(){
            announcers.orderMatched(order);
        });
        serverbook.matchOrder(order);
    },
    orderCancelled : function(data){
        serverbook.removeOrderCancelled(data.id);
    }
};

service.on('request', (rid, key, payload, handler) => {
    console.log(payload); //  { msg: 'hello' }
    if(payload.request === 'hello'){
        handler.reply(null, { msg: 'world' });
        return;
    }
    if(payload.request === 'order-placed'){
        handlers.orderPlaced(payload.data);
        handler.reply(null, { ok : true });
        return;
    }
    if(payload.request === 'order-cancelled'){
        handlers.orderCancelled(payload.data);
        handler.reply(null, { ok : true });
        return;
    }
});