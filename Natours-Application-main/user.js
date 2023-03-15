const express=require('express');
const user_controller = require('./user_functions');


const router=express.Router();

router.get('/',user_controller.get_all_users);
router.post('/',user_controller.create_user);
module.exports=router;


