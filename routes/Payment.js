const express = require("express");
const router = express.Router();

//Importing Required controller functions
const { auth, isStudent } = require("../middlewares/auth");
const { capturePayment, verifySignature } = require("../controllers/Payment");

//************************************************************************ *//
//                                  Payment Routes                          //
//************************************************************************ *//
router.get("/caturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", verifySignature);

//Exporting the router for use in main application
module.exports = router;