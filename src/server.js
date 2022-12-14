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

setInterval(function(){
    link.announce('rpc_test', service.port, {});
}, 1000);

const handlers = {
    orderPlaced : function(data){
        var order = new Order(data);
        serverbook.orderPlaced(order);
        serverbook.matchOrder(order);
    },
    orderCancelled : function(data){
        serverbook.removeOrderCancelled(data.id);
    }
};

service.on('request', (rid, key, payload, handler) => {
    console.log(payload.request,payload.data ? payload.data.clientid : ''); //  { msg: 'hello' }
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