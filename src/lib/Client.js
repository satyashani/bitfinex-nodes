/* * ************************************************************ 
 * Date: 14-Dec-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file Client.js 
 * *************************************************************** */

const { Order } = require("./Order");
const { Orderbook } = require("./Orderbook");
const { ClientHandler } = require("./ClientHandler");

class Client {
    orderbook = null;
    id = "";
    handler;
    
    constructor (id){
        this.orderbook = new Orderbook();
        this.id = id || ("Client_" + Math.random() * 1000 );
    }
    
    init (peer){
        this.handler = new ClientHandler(peer);
    }
    
    testConnect (){
        this.handler.test();
    }
    
    createOrder (qty, price,type){
        var order = new Order({
            clientid : this.id,
            qty : qty,
            price : price,
            type : type
        });
        this.orderbook.placeOrder(order);
        this.handler.placeOrder(order);
    }
    
    cancelOrder (orderid){
        var order = null;
        for(var i=0;i<this.orderbook.length;i++){
            if(orderid === this.orderbook[i].id){
                var order = this.orderbook[i];
                order.cancel();
                break;
            }
        }
        if(order){
            this.orderbook.removeOrderCancelled(order.id);
            handler.cancelOrder(order); 
        }
    }
};

exports.Client = Client;