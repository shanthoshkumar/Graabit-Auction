const express = require('express');

const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

// var multer  = require('multer')
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// })
// const upload = multer({
//     storage: storage
// })
const multer = require('multer');
 
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, __basedir + '/uploads/')
	},
	filename: (req, file, cb) => {
	  cb(null, file.originalname)
	}
});
 
var upload = multer({storage: storage});

router.get('/userProfile/:to',jwtHelper.verifyJwtToken,ctrlUser.userProfile);
router.get('/getUserName/:publickey', ctrlUser.getUserName);
router.get('/getAuctionById/:auctionid', ctrlUser.getAuctionById);
router.get('/productDetails', ctrlUser.productDetails);   
router.get('/userDetails', ctrlUser.userDetails); 
router.get('/getTime', ctrlUser.getTime); 

router.get('/filterClosed', ctrlUser.filterclosed); 
router.get('/filterUpcoming', ctrlUser.filterupcoming); 
router.get('/filterLive', ctrlUser.filterlive); 


router.put('/changepassword',ctrlUser.changepassword);
router.put('/forgotpassword',ctrlUser.forgotpassword);
router.put('/storeselectedproduct',ctrlUser.showselectedproducts)


router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.post('/productdetailssave', ctrlUser.productdetailssave); 
router.post('/fileuploader', upload.single("file"), ctrlUser.fileuploader);

module.exports = router;



