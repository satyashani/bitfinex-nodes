/* * ************************************************************ 
 * Date: 14-Dec-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file client.js 
 * *************************************************************** */

'use strict';

const { PeerRPCClient }  = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

const { Client } = require("./lib/Client");
const enums = require("./lib/enums");

const link = new Link({
  grape: 'http://127.0.0.1:30001'
});
link.start();

const peer = new PeerRPCClient(link, {});
peer.init();

var client = new Client();
client.init(peer);

client.testConnect();
setTimeout(function(){
    client.createOrder(100,100,enums.order.type.buy);
},2000);