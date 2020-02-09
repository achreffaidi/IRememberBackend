const uri = "mongodb+srv://RedWalls:Redwalls123@cluster0-zesmx.azure.mongodb.net/IRemember?retryWrites=true&w=majority";
const mongoose = require('mongoose');

mongoose.connect(uri, {useNewUrlParser: true});

const locationSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    name: String,
    distance: Number
});

const locationModel = mongoose.model('locations', locationSchema);


function toRadians(deg)
{
    return deg * (Math.PI/180);

}

const getPosition= (res)=>{
    locationModel.findOne({name: 'actualPos'}).exec().then(pos=>{
        locationModel.findOne({name: 'safePos'}).exec().then(safe=>{
            var R = 6371e3; // metres
            var lat1=pos.latitude;
            var lat2=safe.latitude;
            var lon1=pos.longitude;
            var lon2=safe.longitude;
            var o1 = toRadians(lat1);
            var o2 = toRadians(lat2);
            var doo = toRadians(lat2-lat1);
            var dl = toRadians(lon2-lon1);
            var a = Math.sin(doo/2) * Math.sin(doo/2) +
                Math.cos(o1) * Math.cos(o2) *
                Math.sin(dl/2) * Math.sin(dl/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            var msg= d>safe.distance ? "The patient is out of the safe zone" : "The patient is in his safe zone";
            res.status(200).json({latitude: lat1,longitude: lon1,distanceFromSafeZone: Math.trunc(d),message: msg});
        }).catch(err =>{
            console.log(err);
            res.status(500).send(err);
        })
    }).catch(err =>{
        console.log(err);
        res.status(500).send(err);
    })

};

const getSafeZone= (res)=>{
    locationModel.findOne({name: 'safePos'}).exec().then(docs=>{
        res.status(200).json(docs)
    }).catch(err =>{
        console.log(err);
        res.status(500).send(err);
    })
};

const setSafeZone = (req,res)=>{

    locationModel.replaceOne({name: 'safePos'},{latitude: req.headers.lat, longitude: req.headers.lang,name: 'safePos',distance: req.headers.safedistance}).exec().then(result=>{
        res.send(result);
    }).catch(err =>{
        console.log(err);
        res.send(err);
    });
};

const setPosition = (req,res)=>{

    locationModel.replaceOne({name: 'actualPos'},{latitude: req.headers.lat, longitude: req.headers.lang,name: 'actualPos',distance: 0}).exec().then(result=>{
        res.send(result);
    }).catch(err =>{
        console.log(err);
        res.send(err);
    });
};

exports.setPosition=setPosition;
exports.getPosition=getPosition;
exports.setSafeZone=setSafeZone;
exports.getSafeZone=getSafeZone;
