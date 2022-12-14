/* * ************************************************************ 
 * Date: 14-Dec-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file Orderbook.js 
 * *************************************************************** */

const enums = require("./enums");

class Orderbook {
    orders = [];
    
    constructor (){
        this.orders = [];
    }
    
    // Place order in local order book
    placeOrder (order){
        this.orders.push(order);
    }
    
    // Respond to orders added in remote order book
    orderPlaced (order){
        this.orders.push(order);
        order.live();
    }
    
    // Match an order on being live
    matchOrder (order){
        for(var i=0;i<this.orders.length;i++){
            if(this.orders[i].status === enums.order.status.live && 
                    this.orders[i].price === order.price &&
                    this.order[i].qty === order.qty &&
                    this.orders[i].type !== order.type){
                order.matched(this.orders[i].id);
                this.orders[i].matched(order.id);
                this.orders.splice(i,1);
                break;
            }
        }
    }
    
    // Remove local order when matched on remote
    removeOrderMatched (order){
        for(var i=0;i<this.orders;i++){
            if(this.orders[i].id === order.id){
                this.orders.splice(i,1);
                break;
            }
        }
    }
    
    // Remove local order when matched on remote
    removeOrderCancelled (orderid){
        for(var i=0;i<this.orders;i++){
            if(this.orders[i].id === orderid){
                this.orders.splice(i,1);
                break;
            }
        }
    }
    
};

exports.Orderbook = Orderbook;