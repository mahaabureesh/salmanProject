

const User = require('./users.model');


exports.Login = async (username, pwd) => {
    const user = await User.findOne({ buisness: username });

    if (user && user.password === pwd) {
        return user;
    }

    return null;
};

const AddUser = async (user) => {
    console.log("--", JSON.stringify(user));
    const newUser = new User(user);
    const x = await newUser.save();
    console.log(`addNewUser ${JSON.stringify(x)}`);
    return (`added new user with id ${x._id}`);
};
exports.AddUser = AddUser;
//------------------------------------------
const GetAllUsers = async () => {
    const x = await User.find();
    console.log(`getAllUsers ${JSON.stringify(x)}`);
    return JSON.parse(JSON.stringify(x));
};
exports.GetAllUsers = GetAllUsers;
//------------------------------------------

const deleteUser = async (theID) => {
    const x = await User.deleteOne({ _id: theID });
    console.log(`deleteUserByID ${JSON.stringify(x)}`);
    return (`deleted ${x.n} documents`);
};
exports.deleteUser = deleteUser;
// ============================================================

const updateUser = async (userID, userInfo) => {
    const x = await User.updateOne({ _id: userID }, userInfo);
    console.log(`updateUserByID ${JSON.stringify(x)}`);
    return x;
};
exports.updateUser = updateUser;
//------------------------------------------

const getUserById = async (theID) => {
    return await User.findById(theID);
};
exports.getUserById = getUserById;
//------------------------------------------

