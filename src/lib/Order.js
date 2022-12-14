/* * ************************************************************ 
 * Date: 14-Dec-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file Order.js 
 * *************************************************************** */

const EventEmitter = require("events");
const enums = require("./enums");

class Order extends EventEmitter {
    id = "";
    price = 0;
    qty = 0;
    type = "";
    status = "";
    matchid = "";
    clientid = "";
    
    constructor (data){
        super();
        
        var clientid = data.clientid || '';
        this.clientid = clientid;
        this.id = data.id || (clientid + "." + new Date().getTime());
        this.price = data.price || 0;
        this.qty = data.qty || 0;
        this.type = data.type || enums.order.type.buy;
        this.status = data.status || enums.order.status.draft;
    }
    
    live (){
        this.status = enums.order.status.live;
        this.emit("live");
    }
    
    cancel (){
        this.status = enums.order.status.cancelled;
        this.emit("cancelled");
    }
    
    matched (matchid){
        this.status = enums.order.status.matched;
        this.matchid = matchid;
        this.emit("matched");
    }
};

exports.Order = Order;

