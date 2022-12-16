const express = require('express');
const router = express.Router();



const { addtransaction, allTransaction, transactionById } = require('../controllers/transaction.controller')
const { authenticateUser } = require('../middlewares/authToken');



router.post("/addtransaction", authenticateUser,addtransaction)
router.get("/alltransaction", authenticateUser, allTransaction)
router.get("/transactionById/:customId", authenticateUser,transactionById)



module.exports = router