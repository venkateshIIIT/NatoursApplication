const fs=require("fs");
let users=JSON.parse(fs.readFileSync("./Data/users.json"));
console.log(users);

exports.get_all_users=(req,res)=>{
    console.log(users);
    res.status(200).json({
        status:"Request satisfied..",
        users:users
    })

};
exports.create_user=(req,res)=>{

    console.log(users);
    console.log(req.body);

    users.push(req.body);
    fs.writeFileSync("./Data/uses.json", JSON.stringify(users));
    res.status(200).json({
        status:"Request satisfied..",
        users:users
    });

};