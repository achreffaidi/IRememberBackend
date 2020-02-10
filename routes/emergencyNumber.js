const uri = "mongodb+srv://RedWalls:Redwalls123@cluster0-zesmx.azure.mongodb.net/IRemember?retryWrites=true&w=majority";
var mongoose =require('mongoose');

mongoose.connect(uri, {useNewUrlParser: true});

const emergencyNumberSchema = new mongoose.Schema({
    id: Number,
    number: String
});

const emergencyNumberModel = mongoose.model('emergencyNumber', emergencyNumberSchema);

const getEmergencyNumber= (res)=>{
    emergencyNumberModel.findOne({id: 1}).exec().then(docs=>{
        res.status(200).json({number: docs.number});
    }).catch(err =>{
        console.log(err);
        res.status(500).send(err);
    });
};



const setEmergencyNumber = (req,res)=>{

    emergencyNumberModel.replaceOne({id: 1},{id: 1,number: req.headers.number}).exec().then(result=>{
        res.send(result);
    }).catch(err =>{
        console.log(err);
        res.send(err);
    });
};

exports.getEmergencyNumber=getEmergencyNumber;
exports.setEmergencyNumber=setEmergencyNumber;