const { json } = require("express");
const fs=require("fs");
const Tour=require("./database_model");



exports.aliasTopTours=(req,res,next)=>{
    req.query.limit='3';
    req.query.sort='-durations,price';
    req.query.fields='durations,name,price,createdAt';
    console.log(req.query);
    next();
}


class APIFeatures{

    constructor(query,query_str){
        this.query=query;
        this.query_str=query_str;
    }

    filter(){
        const query_obj={...this.query_str};
        const exclude_params=["page","sort","limit","fields"];
        exclude_params.forEach(ele=> delete query_obj[ele]);
        let query_str=JSON.stringify(query_obj);
       query_str=query_str.replace(/\b(lt|gt|lte|gte)\b/g ,match=>`$${match}`);
        this.query.find(JSON.parse(query_str));
      
        return this;
    }
    sort(){
        if(this.query_str.sort){
            const sortBy=this.query_str.sort.split(',').join(' ');
            this.qurey=this.query.sort(sortBy);
       }else{
        this.query=this.query.sort("createdAt");
       }
       return this;

    }
    limitFields(){
        if(this.query_str.fields){
            const fields=this.query_str.fields.split(',').join(' ');
       console.log(fields);
       this.query=this.query.select(fields);
        
        }
        return this;
        
    }
    paginate(){
        const page=this.query_str.page *1 || 1;
       const limit=this.query_str.limit *1 || 100;
       const skip=(page-1)*limit;
       this.query=this.query.skip(skip).limit(limit);
        return this;

    }


};


exports.get_all_tours=async (req,res)=>{
    
    

  

    try{
       
       
        let  featured_tour=  new APIFeatures(Tour.find(),req.query)
       .filter().sort().limitFields().paginate();
       
       let tours=await featured_tour.query;
       
        res.status(200).json({
            status:"Everything is Okk...", 
            tours: tours
        });
    }
    catch(err){
        res.status(400).json({
            status:"Error has occured while accessing tours...",
            msg:err
        });

    }
   
};

exports.get_tour_stats=async(req,res)=>{

    try{
        console.log("errb");

        const stats=await Tour.aggregate([

            {
                $match:{ durations:{$gte:1} }
            },
            {
                $group:{
                    // _id:null,
                    _id:'$difficulty',
                    count_items_in_this_group:{$sum:1},
                    avgRating:{$avg:'$ratingAverage'},
                    avgDurations:{$avg:'$durations'},
                    avgPrice:{$avg:'$price'},
                    minPrice:{$min:'$price'},
                    maxPrice:{ $max:'$price'},
                }

            },
            {
                $sort:{ avgDurations:-1}
            },{
                $match:{_id:{$ne:"easy"}}
            }

        ]);
        console.log(stats)
        res.status(200).json({
            status:"Successfully grouped...",
            data: stats
        }
        )

    }
    catch(err){

    }

};

exports.get_busy_month=async(req,res)=>{

    try{    
        console.log(req.params);
        const year=req.params.year *1;
        console.log(year);
        const stats=await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{ 
                    startDates:{
                     $gte:new Date(`${year}-01-01`),
                     $lte:new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id :{ $month:'$startDates' },
                    Num_of_tours:{$sum:1},

                }
            } 
            ,
            {
                $addFields:{month:'$_id'}
            },
            {
                $project:{"_id":0}
            } ,
            {
                $sort:{Num_of_tours:-1}
            }
           
        ]);

        res.status(200).json({
            status:"Succesfully Queried...",
            data:stats
        })

    }catch(err){

        res.status(400).json({
            status:"There is problem..",
            msg:err
        });

    }


}

exports.create_tour=async (req,res)=>{

    try{

        const new_tour=await Tour.create(req.body);

        res.status(200).json({
            status:"New tout has created....",
            tour:new_tour
        });
    }catch(err){
        res.status(400).json({
            status:"Trobling in creating a tour",
            msg:err
        });
    }
};




exports.get_tour=async (req,res)=>{

    try{

        const tour=await Tour.findById(req.params.id);
        res.status(200).json({
            status: "Tour is found",
            tour:tour
        });

    }
    catch(err){

        res.status(400).json({
            status:"Unable to find tour"
        });

    }
    
    
    // if(req.params.id*1 >tours.length){
    //         return res.status(400).json({
    //             status:"Bad request..",
    //             msg:"id is not found"
    //         });
    // }
    // for(let x of tours){
    //     if(x.id*1==req.params.id*1){
    //         console.log(x);
    //         res.status(200).json(x);
    //     }
    // }
};


exports.change_tour=async (req,res)=>{

    // console.log(req.params.id);

    try{

        const tour=await Tour.findByIdAndUpdate(req.params.id,req.body,{new:true,useValidators:true});

        res.status(200).json({
            status:"Successfully Updated...",
            data:{
                tour
            }
        });
    }
    catch(err){

        res.status(400).json(err);


    }


    // if(req.params.id*1 >tours.length){
    //         return res.status(400).json({
    //             status:"Bad request..",
    //             msg:"id is not found"
    //         });
    // }
    
    // let x=req.params.id*1;
    // // console.log(tours[x-1]);
    // tours[x-1].tour="Hyderabad";

    // // console.log(tours[x-1]);
    // fs.writeFileSync("./Data/tours.json",JSON.stringify(tours));
    // res.status(200).json({
    //     status:"Job comoleted",
    //     msg: "Data changed"
    // });
};


exports.delete_tour=async (req,res)=>{
    
    // console.log(req.params.id);

    try{


        await Tour.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            status:"Tour is deleted successfully...",
        });


    }
    catch(err){
        res.status(404).json({
            msg:err
        })

    }

    // if(req.params.id*1 >tours.length){
    //     return res.status(400).json({
    //         status:"Bad request..",
    //         msg:"id is not found"
    //     });
    // }

    // tours.splice(req.params.id*1 -1,1);
    // // console.log(tours);

    // fs.writeFileSync("./Data/tours.json",JSON.stringify(tours));
    // res.status(200).json({
    //     status:"Jon is done...",
    //     msg:"Tour is deleted 💥💥💥💥💥"

    // });
};

