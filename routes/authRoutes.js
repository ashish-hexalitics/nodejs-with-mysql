const router = require("express").Router();
const {
login,
register,
sendforgotPasswordOtp,
matchforgotPasswordOtp,
forgotPassword,
resetPasword
} = require("../controllers/authController");

//user routes
router.post("/login", login);
router.post("/register", register);
router.post("/sendforgotPasswordOtp", sendforgotPasswordOtp);
router.post("/matchforgotPasswordOtp", matchforgotPasswordOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPasword", resetPasword);


module.exports = router;
