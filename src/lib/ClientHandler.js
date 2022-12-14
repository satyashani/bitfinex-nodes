/* * ************************************************************ 
 * Date: 14-Dec-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file ClientHandler.js 
 * *************************************************************** */

class ClientHandler {
    peer;
    
    constructor(peer){
        this.peer = peer;
    }
    
    test (){
        this.peer.request('rpc_test', { request: 'hello' }, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
            console.log(data);
        });
    }
    placeOrder (order){
        this.peer.request('rpc_test',{ request : "order-placed",  data : order}, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log(data);
        });
    }
    
    cancelOrder (order){
        this.peer.request('rpc_test',{ request : "order-cancelled", data : order }, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log(data);
        });
    }
};

exports.ClientHandler = ClientHandler;