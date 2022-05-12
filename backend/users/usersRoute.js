const express = require('express');
const router = express.Router();
const usersRepository = require('../myRepository');
const app = express();

// Get a person by userName
// router.get("/:Buisness", async (req, res) => {
//     try {
//         const x = await usersRepository.getUserByUserName(req.params.Buisness)
//         res.send(x);
//     } catch (e) {
//         console.log(e);

//     }
// });

//----------------------------------------
router.post("/", async (req, res) => {
    try {
        const x = await usersRepository.AddNewUser(req.body);
        res.send(x);
    } catch (e) {
        console.log(e);

    }
});
//------------------------------------------
router.post("/login", usersRepository.signIn);



module.exports = router;
