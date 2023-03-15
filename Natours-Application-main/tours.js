const express=require('express');
const tours_controller=require('./tour_functions.js');


const router=express.Router();


router.get('/',tours_controller.get_all_tours);
router.post('/',tours_controller.create_tour);
router.route('/top-3-cheap').get(tours_controller.aliasTopTours,tours_controller.get_all_tours);
router.route('/tour-stats').get(tours_controller.get_tour_stats);
router.route('/busy_month/:year').get(tours_controller.get_busy_month);
router.get('/:id',tours_controller.get_tour);
router.patch('/:id',tours_controller.change_tour);
router.delete("/:id",tours_controller.delete_tour);



module.exports =router;



