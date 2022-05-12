const connectionhelper = require('../connetToDB')




function getAllOrders() {
    return new Promise(async (resolve, reject) => {
        let y = await connectionhelper.connectionfun()
        const product = y.query(`SELECT * FROM orders`, (err, rows) => {

            if (!err) {
                console.log('The data from orders table are: \n', rows)
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



exports.getAllOrders = getAllOrders;
