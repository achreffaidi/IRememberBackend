var mongoose =require('mongoose');
const uri = "mongodb+srv://RedWalls:Redwalls123@cluster0-zesmx.azure.mongodb.net/IRemember?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});

const stateSchema = mongoose.Schema({
    id:Number,
    battery :Number,
    timestamp: String
});

const State =mongoose.model('State',stateSchema);

const getState =  (res)=>{
    State.findOne({id: 1}).exec().then(docs=>{
        console.log(docs);
        res.status(200).json({'battery': docs.battery,'difference': Math.trunc(Date.now()/1000-docs.timestamp)});
    }).catch(err =>{
        console.log(err);
        res.status(500).send(err);
    })
};


const setState= (req,res)=>{
    State.replaceOne({id: 1},{id: 1, battery: req.headers.battery, timestamp: Math.trunc(Date.now()/1000) }).exec().then(result=>{
        res.send(result);
    }).catch(err =>{
        console.log(err);
        res.send(err);
    });
};

exports.getState=getState;
exports.setState=setState;