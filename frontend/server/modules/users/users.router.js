
const myRepository = require('./users.controller');
const express = require('express');
const router = express.Router();
const app = express();


//--------------------------------------
// Get all people
router.get("/", async (req, res) => {
    const x = await myRepository.GetAllUsers()
    res.send(x);
}

);

//--------------------------------------
// Get a person by id
router.get("/:id", async (req, res) => {
    const x = await myRepository.getUserById(req.params.id)

    res.send(x);
});
//--------------------------------------
// Add new person

router.post("/", async (req, res) => {
    let isAllOK = await myRepository.AddUser(req.body);
    if (isAllOK === true) {
        res.send("added new user");
    }
    else {
        res.send("unsuccessful adding new user");
    }
});

router.post("/login", async (req, res) => {
    const { username, pwd } = req.body;
    const data = await myRepository.Login(username, pwd);

    return res.json({ data: data });
});


//--------------------------------------
// update person
router.put("/:id", async (req, res) => {

    let isAllOK = await myRepository.updateUser(req.params.id, req.body);
    if (isAllOK.modifiedCount === 1) {
        res.send("Successfully updated")
    }
    else {
        res.send("unsuccessful update")
    }


});
//--------------------------------------
// delete person by id
router.delete("/:id", async (req, res) => {
    let isAllOK = await myRepository.deleteUser(req.params.id);
    if (isAllOK === true) {
        res.send("deleted user");
    }
    else {
        res.send("user with the provided id doesn't exist");
    }


});


module.exports = router;