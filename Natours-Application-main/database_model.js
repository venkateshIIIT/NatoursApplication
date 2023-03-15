const mongoose=require('mongoose');


const tour_schema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Name is required.."],
        unique:true
    },
    durations:{
        type:Number,
        require:[true,"A tour must have a duration..."]
    },
    maxGroupSize:{
        type:Number,
        required:[true,"A tour must have a group size.."]
    },
    difficulty:{
        type:String,
        required:[true,"A tour must have a difficluty.."]
    },
    ratingAverage:{

        type:Number,
        default:4.5
    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    priceDiscount:Number,
    summery:{
        type:String,
        trim:true,
        required:[true,"A tour musst have a summery.."]
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,"A tour must have a cover image.."]
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now
    },
    startDates:[Date],




    price:{
        type:Number,
    }

    ,
    rating:{
        type:String,
        required:[true,"Rating is required..."]
    }
},{
    toJSON:{ virtuals:true},
    toObject:{virtuals:true}
});

// if one parameter defines another parameter then we can use virtuals..
tour_schema.virtual("durationWeeks").get(function(){
    
    tour_schema.durationsWeeks=this.durations/7;
    return this.durations/7;
});


// Document Middle Wares.... 
// pre() & post()
// .save & .create


tour_schema.pre('save',function(next){
    console.log('ef');
    this.name="Siva Sai";
    next();
    console.log(this);
});

tour_schema.post('save',function(next){

    console.log("Document is saved succesfully...");
    next();
});

// Query Middle Ware
// pre() & post()
// find
// findOne

tour_schema.pre('find',function(next){

    this.find({price:{$gt:20}});
    next();
});

tour_schema.post('find',function(next){
    console.log("Query is executed succesfully....");
});









const Tour=mongoose.model('Tour',tour_schema);
module.exports=Tour;





