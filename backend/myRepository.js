const connectionhelper = require('./connetToDB')
const jwt = require('jsonwebtoken');
const { CLIENT_TRANSACTIONS } = require('mysql/lib/protocol/constants/client');

const jwtKey = 'my_secret_key';
const jwtExpiryTimeInMilliSeconds = 1000 * 60 * 15; // 15 min



//----------------------------------------------------------------------
function myCheckUserPasswordService(Buisness, password) {
    return new Promise(async (resolve, reject) => {
        try {
            let y = await connectionhelper.connectionfun()
            y.query(`SELECT * FROM users WHERE businessName ='${Buisness}' and password='${password}' `, (err, rows) => {
                if (err) {
                    console.log("there was an error while sending query to"
                        + " db to get the customer details by uname and pass", err)
                    y.release()
                    reject(err);
                } else {
                    console.log("myCheckUserPasswordService - rtnd rows ", rows)
                    y.release()
                }
                if (Object.keys(rows).length > 0) {
                    console.log('Found data for the provided uname and pass: ', rows);
                    const user = rows[0];
                    resolve({ isPassOK: true, priceType: user.priceType });
                }
                else {
                    resolve({ isPassOK: false })
                }
            })
        }
        catch (err) {
            reject("myCheckUserPasswordService error: ", err)
        }
    })
}
exports.myCheckUserPasswordService = myCheckUserPasswordService
//---------------------------------------------------------------------
const getorderIdByUserName = async (userName) => {
    return new Promise(async (resolve, reject) => {
        let y
        try {
            y = await connectionhelper.connectionfun()
        }
        catch (err) {
            reject("getorderIdByUserName - connection to DB not successful ", err)
        }
        y.query(`SELECT orders.id FROM orders JOIN users ON users.id = orders.userId WHERE users.businessName = '${userName}'`, (err, rows) => {
            if (err) {
                console.log("getorderIdByUserName - there was an error while sending query to"
                    + " db to SELECT id FROM users WHERE businessName", err)
                y.release()
                reject(err);
            } else {
                console.log("getorderIdByUserName - rtnd rows ", rows)
                y.release()
            }
            if (Object.keys(rows).length === 1) {
                console.log("getorderIdByUserName - rtnd rows ", rows)
                resolve(rows[0].id)
            }
            else {
                reject(`getorderIdByUserName - error - more than one users with the same username ${userName}`)
            }
        })
    })
}
exports.getorderIdByUserName = getorderIdByUserName
//---------------------------------------------------------------


const getCartById = async (userName) => {
    return new Promise(async (resolve, reject) => {
        let y
        try {
            y = await connectionhelper.connectionfun()
        }
        catch (err) {
            reject("getCartById - connection to DB not successful ", err)
        }

        y.query(`SELECT  OrderId , ProductId , Quantity , UnitePrice , status , productName FROM orderitems JOIN orders ON orders.id = orderitems.OrderId JOIN users ON orders.userId = users.id WHERE users.businessName = '${userName.userName}'  `, (err, rows) => {
            console.log(userName, "get cart by id uuuuuuuuuuuuu");
            if (err) {
                console.log("getCartById - there was an error while sending query to"
                    + " db to SELECT id FROM users WHERE businessName", err)
                y.release()
                reject(err);
            } else {
                console.log("getCartById - rows ", rows.productName)
                y.release()
            }
            if (Object.keys(rows).length > 1) {
                console.log("getCartById - rtnd rows ", rows)
                resolve(rows)
            }
            else {
                reject(`getCartById - error -errrrrrr`)
            }
        })
    })
}
exports.getCartById = getCartById


//---------------------------------------------------------------
function AddItemToOrder(req) {

    return new Promise(async (resolve, reject) => {
        let y
        let x
        console.log(req, "the req from AddItemToOrder !!!!!!!!!!");

        try {
            y = await connectionhelper.connectionfun()
        }
        catch (err) {
            reject("connection not successful myCheckUserPasswordService ", err)
        }

        try {
            x = await getorderIdByUserName(req.userName)
            console.log(x, "line 114");
        }

        catch (err) {
            reject("couldnt get user by id from function getorderIdByUserName ", err)
        }
        try {
            y.query(`INSERT INTO orderitems(ProductId,OrderId,Quantity,productName,UnitePrice) VALUES (?,?,?,?,?)`, [req.id, `${x}`, req.quantity, req.productName, req.price], (err, rows) => {
                console.log(req.productName, "#####");
                if (!err) {
                    y.release()
                    resolve("successfully added item to order")

                } else {
                    console.log(err)
                    y.release()
                    reject(err);
                }
            })
        }
        catch (err) {
            console.log(err, "err from query");

        }

    })
}
exports.AddItemToOrder = AddItemToOrder

//---------------------------------------------------------------------//   creates and returns jwt token 
//     (only if username, password match our records)
const signIn = async (req, res) => {
    // Get credentials (username and password) from JSON body
    //   and use our service to check if they are OK
    const { businessName, password } = req.body;
    const { isPassOK, priceType } = await myCheckUserPasswordService(businessName, password);
    if (!isPassOK) {
        // return 401 error if authentication not OK  
        return res.status(401).send("username or password didnt match the info we have");

    }

    console.log(`pricetype: ${priceType}`);

    // once we got here, we know that a user with the provided uname and pass exists in the db,
    //          lets get a cart for him 
    // let cartnum
    // try {
    //     console.log("signIn - going to try to get a cart for the user");
    //     let resultFromGetCartForTheUser = await getCartForTheUser(username);
    //     cartnum = resultFromGetCartForTheUser;
    // }
    // catch (err) {
    //     console.log(`signIn - while we were waiting for getCartForTheUser there was an error:  ${err}`);
    //     return res.status(500).send("error getting a cart");
    // }

    // Create a new token with the username in the payload
    //  which expires X seconds after issue
    let token;
    try {
        let X = jwtExpiryTimeInMilliSeconds;
        token = jwt.sign({ businessName }, jwtKey, {
            algorithm: 'HS256',
            expiresIn: X
        })
    }
    catch (err) {
        console.log("signin - error while creating the new token: " + err);
    }
    console.log('signin - successfully creaeted token:', token);
    // const Id = isPassOK.id
    // set a cookie named 'token' with value = the token string we created above, 
    //   with max age 
    // here, the max age is in milliseconds, so we multiply by 1000
    res.cookie('token', token, { maxAge: jwtExpiryTimeInMilliSeconds })
    res.json({ priceType, businessName, token });
}

exports.signIn = signIn
//------------------------------------------------------------------------------------
const refresh = (req, res) => {
    console.log("going to try to refresh the token (if there is one and it is still valid");

    let statusCode = 200 // OK
    const token = req.cookies.token;
    console.log(token, "+++++++++++++++++++++++++++++++++");

    if (!token) {
        console.log('refresh - couldnt find token in cookies');
        statusCode = 401;
        return statusCode;
    }
    // once we got here, it means we did found a token in the cookies
    let payload;
    try {
        payload = jwt.verify(token, jwtKey);
    }
    catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            console.log("refresh - jwt.JsonWebTokenError error: " + e);
            statusCode = 401
            return statusCode;
        }
        console.log('refresh - error while reading the token, but NOT a jwt.JsonWebTokenError: ', e);
        statusCode = 400;
        return statusCode;
    }

    // Once we got here it means the token was checked and is valid
    // Now, create a new token for the current user, 
    //   with a renewed expiration time
    console.log("refresh - yayyy we got payload: ", payload);
    console.log("refresh - now creating NEW TOKEN with extended time");

    // need this row when using the cart !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // const newToken = jwt.sign({ username: payload.username, cartnum: payload.cartnum }, jwtKey, {

    const newToken = jwt.sign({ businessName: payload.businessName, }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpiryTimeInMilliSeconds
    })

    // Set the new token as the users `token` cookie
    console.log(`refresh - the new refreshed token - ${newToken}`);
    res.cookie('token', newToken, { maxAge: jwtExpiryTimeInMilliSeconds })
    res.thePayload = payload;
    // once we got here it means the statusCode is still 200 (as we initialized to be)
    return statusCode; // returning 200
}
module.exports.refresh = refresh

//---------------------------------users---------------------------------------------------
function getUserByUserName(Business) {
    return new Promise(async (resolve, reject) => {
        let y = await connectionhelper.connectionfun()
        const user = y.query(`SELECT * FROM users WHERE businessName ='${Business}'`, (err, rows) => {

            if (!err) {
                console.log('The data from users table are: \n', rows)
                y.release()
            } else {
                console.log(err)
                y.release()
                reject(err);
            }
            if (Object.keys(rows).length > 0) {
                console.log(rows, "from line 25")
                resolve(true)
            }
            else {
                console.log(rows, " from line 30")
                resolve(false)
            }
        })
    })
}
exports.getUserByUserName = getUserByUserName;


//----------------------------------

function AddNewUser(req) {
    return new Promise(async (resolve, reject) => {
        let y = await connectionhelper.connectionfun()
        y.query('INSERT INTO users (firstName,lastName,businessName,password,mobilePhone,faxNumber,businessPhone,email,adress,priceType,userTypeId,BNnumber) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', [req.firstName, req.lastName, req.businessName, req.password, req.mobilePhone, req.faxNumber, req.businessPhone, req.email, req.adress, req.priceType, req.userTypeId, req.BNnumber,], (err, rows) => {
            if (!err) {
                console.log('The data from users table are: \n', rows);
                y.release()
            } else {
                console.log(err);
                y.release()
                reject(err);
            }

        })
    })
}
exports.AddNewUser = AddNewUser

//------------------------------products-----------------------------------------------

function getAllProducts() {
    return new Promise(async (resolve, reject) => {
        let y = await connectionhelper.connectionfun()
        const product = y.query(`SELECT * FROM products`, (err, rows) => {

            if (!err) {
                console.log('The data from products table are: \n', rows)
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



exports.getAllProducts = getAllProducts;
//----------------------------------------------

