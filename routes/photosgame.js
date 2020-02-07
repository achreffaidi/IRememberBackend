const request = require('request');

let subscriptionKey = process.env.BING_IMAGE_KEY;
let path = process.env.BING_IMAGE_ENDPOINT;

var mongoose =require('mongoose');

const uri = "mongodb+srv://redwalls:redwalls@cluster0-jivu8.azure.mongodb.net/IRemember?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});



const photosGameSchema = new mongoose.Schema({
    category: {
        type: String
    },
    chosen: {
        type: String
    },
    labels: {
        type: Array
    }
});

const photosgameModel = new mongoose.model('photosgames',photosGameSchema);


const imageLinks = async (image1,image2,res) => {

    const options = {
        uri: path + '?q='+  encodeURIComponent(image1) + '?size=small'+ '?licence=public',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
    };

    const options2 = {
        uri: path + '?q='+  encodeURIComponent(image2) + '?size=small'+ '?licence=public',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
    };

    console.log(options);


    request.get(options, (err,responce,body) => {

        var returnLinks = {};

        const bodyJson = JSON.parse(body);
        const value = bodyJson.value;
        console.log(bodyJson);
        let random = Math.floor( Math.random() * value.length );
        const photo = value[random];
        returnLinks.link1 = photo.thumbnailUrl;



        request.get(options2, (err2,responce2,body2) => {


            const bodyJson2 = JSON.parse(body2);
            const value2 = bodyJson2.value;
            let random2 = Math.floor( Math.random() * value2.length );
            const photo2 = value2[random2];
            returnLinks.link2 = photo2.thumbnailUrl;

            res.json({
                links: returnLinks
            });

        } );


    } );
};



const getAllCategories = (res) => {

    const query = photosgameModel.find();
    const promise = query.exec();

    promise.then(
        data => {
            console.log(data);
            res.statusCode = 200;
            res.json({
                categoriesList: data
            });
        }
    ).catch(
        err => {
            console.error(err);
            res.statusCode = 400;
            res.json({
                error: 'can\'t load categories'
            });
        }
    )

};

const setAllToUnchosen = async () => {
    await photosgameModel.updateMany({}, { $set: { chosen: false } });
};

const setCategoriesToChosen = async (categories,res) => {

    await setAllToUnchosen();

    /*
    const query =  photosgameModel.find( {category: { '$in': categories } } );
    query.update( { chosen: true } );
    const promise = query.exec();
    promise.then(
        data => {
            console.log(data);
            res.statusCode = 200;
           res.send();
        }
    ).catch(
        err => {
            console.error(err);
            res.statusCode = 400;
            res.send();
        }
    );
    */

    var v = true;
    categories.forEach(  category => {
        const query =   photosgameModel.findOneAndUpdate( {category: category }, { chosen: true } );
        query.then( data => { v &= true; },
            err => {  v &= false; } );
    } );

    if(v === true){
        res.statusCode = 200;
        res.send();
    }else {
        res.statusCode = 400;
        res.send();
    }




};


exports.imageLinks = imageLinks;
exports.getAllCategories = getAllCategories;
exports.setCategoriesToChosen= setCategoriesToChosen;
