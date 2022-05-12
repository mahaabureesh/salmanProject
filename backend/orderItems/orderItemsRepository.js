const connectionhelper = require('../connetToDB')




function addToCart() {
    return new Promise(async (resolve, reject) => {
        let y = await connectionhelper.connectionfun()
        const product = y.query(`INSERT INTO orderitems ()`, (err, rows) => {

            if (!err) {
                console.log('The data from orderItems table are: \n', rows)
                y.release()
            } else {
                console.log(err)
                y.release()
                reject(err);
            }

            resolve(rows)

        })
    })
}



exports.addToCart = addToCart;
//-------------------------------------------------
function getAllOrderItems() {
    return new Promise(async (resolve, reject) => {
        let y = await connectionhelper.connectionfun()
        const product = y.query(`SELECT * FROM orderitems `, (err, rows) => {

            if (!err) {
                console.log('The data from orderitems table are: \n', rows)
                y.release()
            } else {
                console.log(err)
                y.release()
                reject(err);
            }

            resolve(rows)

        })
    })
}



exports.getAllOrderItems = getAllOrderItems;