/* * ************************************************************ 
 * Date: 14-Dec-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file enums.js 
 * *************************************************************** */


const enums = {
    order : {
        type : {
            buy : "Buy",
            sell : "Sell"
        },
        status : {
            draft : "Draft",
            live : "Live",
            matched : "Matched",
            cancelled : "Cancelled"
        }
    }
};

module.exports = enums;
