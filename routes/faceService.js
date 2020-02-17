const request  = require('request');
const formidable = require('formidable');
const uuid = require('uuid/v4');

var index = uuid();

var personObject = {};

const uploadPhoto1 = (res, req) => {

    var form = new formidable.IncomingForm();
    form.uploadDir ='./uploads';
    form.keepExtensions = true;
    form.type = true;
    form.on('fileBegin', function (name, file){
        // console.log(file);
        const extentionTab = file.type.split('/');
        const extention = extentionTab[1];
        file.path = __dirname + '\\..\\uploads\\' + index + '.png' ;
        file.type = 'image/png';
        file.name = index + '.png';

        personObject.image1 = 'https://i-remember2.azurewebsites.net/image/'+file.name;

        index = uuid();
    });



    form.parse(req, (err, fields, files) => {

        if(err) {
            res.statusCode = 400;
            res.send();
        }

        //   fs.rename(files.image.path, './uploads/'+files.image.name, (err) => {if (err) throw err;});
        console.log('Fields');
        //  console.log(fields);
        console.log('Files');
        //  console.log(files.file);

        res.statusCode = 200;
        res.send();
    });



};



const uploadPhoto2 = (res,req) => {

    var form = new formidable.IncomingForm();
    form.uploadDir ='./uploads';
    form.keepExtensions = true;
    form.type = true;
    form.on('fileBegin', function (name, file){
        // console.log(file);
        const extentionTab = file.type.split('/');
        const extention = extentionTab[1];
        file.path = __dirname + '\\..\\uploads\\' + index + '.png' ;
        file.type = 'image/png';
        file.name = index + '.png';

        personObject.image2 = 'https://i-remember2.azurewebsites.net/image/'+file.name;

        index = uuid();
    });



    form.parse(req, (err, fields, files) => {

        if(err) {
            res.statusCode = 400;
            res.send();
        }

        //   fs.rename(files.image.path, './uploads/'+files.image.name, (err) => {if (err) throw err;});
        console.log('Fields');
        //  console.log(fields);
        console.log('Files');
        //  console.log(files.file);

        res.statusCode = 200;
        res.send();
    });

};


const uploadPhoto3 = (res, req) => {

    var form = new formidable.IncomingForm();
    form.uploadDir ='./uploads';
    form.keepExtensions = true;
    form.type = true;
    form.on('fileBegin', function (name, file){
        // console.log(file);
        const extentionTab = file.type.split('/');
        const extention = extentionTab[1];
        file.path = __dirname + '\\..\\uploads\\' + index + '.png' ;
        file.type = 'image/png';
        file.name = index + '.png';

        personObject.image3 = 'https://i-remember2.azurewebsites.net/image/'+file.name;

        index = uuid();
    });



    form.parse(req, (err, fields, files) => {

        if(err) {
            res.statusCode = 400;
            res.send();
        }

        //   fs.rename(files.image.path, './uploads/'+files.image.name, (err) => {if (err) throw err;});
        console.log('Fields');
        //  console.log(fields);
        console.log('Files');
        //  console.log(files.file);

        res.statusCode = 200;
        res.send();
    });
};

const getPersonNameAndUserdata = (person, res) => {
  
    personObject = {};
    
    personObject.name = person.name;
    personObject.userdata = person.userdata;
    
    res.statusCode = 200;
    res.send();
    
};

const addPerson = (req, res) => {

    console.log(personObject);

    const options = {
        uri: process.env.FACE_API_HOST+'persongroups/friends/persons',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : process.env.FACE_API_KEY
        },body: '{"name":"'+personObject.name+'" , "userData": "'+personObject.userdata+'"}'
    };
    //console.log(req.headers)
    //console.log(options);


    request.post(options, (error, responce, body) => {

        if(body){

            try {
                const bodyJson = JSON.parse(body);
                const personId = bodyJson.personId;
                personObject.personId = personId;
                trainImage(personId, personObject.image1);
                trainImage(personId, personObject.image2);
                trainImage(personId, personObject.image3);

                console.log(personObject);

                res.statusCode = 200;
                res.send();
            }catch (e) {

                res.statusCode = 400;
                res.send();
            }

        }


    });


};

const trainImage = (personId,imageUrl) => {

    const  options = {
        uri: process.env.FACE_API_HOST+'persongroups/friends/persons/'+personId +'/persistedFaces?detectionModel=detection_01',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : process.env.FACE_API_KEY
        },
        body: '{"url": ' + '"' + imageUrl + '"}'
    };

    console.log(options);


    request.post(options, (error, responce, body) => {

        const b = JSON.parse(body);
        console.log(b);

        if (b.hasOwnProperty('error')) {

            return 0;
        }

        const  options2 = {
            uri: process.env.FACE_API_HOST+'persongroups/friends/train',
            headers: {
                'Ocp-Apim-Subscription-Key' : process.env.FACE_API_KEY
            }
        };

        request.post(options2, (error2, responce2, body2) => {
            if(error2){

                return 0;
            }else {

                return 0;
            }
        });

    });


};


exports.uploadPhoto1 = uploadPhoto1;
exports.uploadPhoto2 = uploadPhoto2;
exports.uploadPhoto3 = uploadPhoto3;
exports.addPerson = addPerson;
exports.getPersonNameAndUserdata = getPersonNameAndUserdata;
