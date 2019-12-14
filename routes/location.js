var mongoose =require('mongoose');



const uri = "mongodb+srv://redwalls:redwalls@cluster0-jivu8.azure.mongodb.net/IRemember?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});


const locationSchema = new mongoose.Schema({
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    loc: {
        type: Number
    }
});


const locationModel = mongoose.model('locations', locationSchema);


const setLocationMongoose = async (location) => {

    console.log(location);

    const {long,lat} = location;
    const doc = await locationModel.findOneAndUpdate({loc: 0},{longitude: long, latitude: lat});
    console.log(doc);




}

const getLocationMongoose = (res) => {
    const query =  locationModel.findOne();
    const promise = query.exec();
    promise.then(data => {
        const {latitude,longitude} = data;
        console.log(data);
        res.statusCode = 200;
        //res.json(data);
        res.json({
            latitude: latitude,
            longitude: longitude
        });
    }).catch(err => {
        console.log(err);
        res.statusCode = 400;
        res.send();
    })

}



exports.setLocation = setLocationMongoose;
exports.getLocation = getLocationMongoose;