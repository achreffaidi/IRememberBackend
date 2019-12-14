var express = require('express');
var router = express.Router();
const fs = require('fs');
var formidable = require('formidable');
const path = require('path');
const request = require('request');
const uuid = require('uuid/v4');
const env = require('dotenv').config();
const speech = require('./speech');
const tasksService = require('./tasks');
const memoriesService = require('./memories');
const locationService = require('./location');




var index = uuid();




router.get('/memories', function(req, res, next) {

    memoriesService.getAllMemories(res);

});

router.post('/memories/add', function(req, res, next) {

try {

    var  {title,description,date} = req.headers;
    console.log(req.body);
        var filePath;
        var fileName;
        var form = new formidable.IncomingForm();
        form.uploadDir = './uploads';
        form.keepExtensions = true;
        form.type = true;
        form.on('fileBegin', function (name, file) {
            const extentionTab = file.type.split('/');
            const extention = extentionTab[1];
          //  file.path = __dirname + '\\..\\memories\\' + 'memory' + index + '.png';//+ extention;
            file.path = 'D:/home/site/wwwroot/memories/'+'memory' + index + '.png';//+ extention;
            file.type = 'image/png';
            file.name = index + '.png';
            filePath = file.path;
            fileName = 'memory'+ file.name;
            console.log(file);
            index = uuid();
        });
        form.parse(req, (err, fields, files) => {

            if (err) throw err;

            const memory = {
                title: title,
                description: description,
                date: date,
                pictureId: 'p'+index,
                pictureUrl: 'https://i-remember.azurewebsites.net/memoryImage/'+fileName
            };
            console.log(memory);
            memoriesService.addMemory(memory);
            index = uuid();
            res.statusCode=200;
            res.send();
        });




}catch (e) {
    console.log(e.message);
    res.statusCode=400;
    res.send();
}
    });


router.post('/memories/delete/:pictureId', function(req, res, next) {



    const {pictureId} = req.params;

    console.log(pictureId);

    if(!pictureId){
        res.statusCode = 400;
        res.send();
        return 0;
    }else {

        memoriesService.removeMemory(pictureId,res);

    }

});


router.get('/memoryImage/:fileName',  (req,res) => {

    const {fileName} = req.params;

    if(!fileName){
        res.statusCode = 404;
        res.send('');
        return 0;
    }

    const uploadsDir = path.join('D:/home/site/wwwroot/memories');
   // const uploadsDir = path.join('../memories');
    console.log(uploadsDir);
    fs.readdir(uploadsDir, (err, files) => {
        if(err) {
            return res.send('No files found');
        }
        let name = false;

        files.forEach( (file, key) => {
            if ( file === fileName  ) name = file;
        });

        if( !name )
            res.send('File not found');
        else
            res.sendFile(name, { root: uploadsDir }, (err) => {
                if (err) throw err;
            } )


    })
});





router.get('/image/:fileName',  (req,res) => {

    const {fileName} = req.params;

    if(!fileName){
        res.statusCode = 404;
        res.send('');
        return 0;
    }

    const uploadsDir = path.join('D:/home/site/wwwroot/uploads');
    console.log(uploadsDir);
    fs.readdir(uploadsDir, (err, files) => {
        if(err) {
            return res.send('No files found');
        }
        let name = false;

        files.forEach( (file, key) => {
            if ( file === fileName  ) name = file;
        });

        if( !name )
            res.send('File not found');
        else
            res.sendFile(name, { root: uploadsDir }, (err) => {
                if (err) throw err;
            } )


    })
});



router.get('/speech/:fileName',  (req,res) => {

    const {fileName} = req.params;

    if(!fileName){
        res.statusCode = 404;
        res.send('');
        return 0;
    }

    const uploadsDir = path.join('D:/home/site/wwwroot/speech');
    console.log(uploadsDir);
    fs.readdir(uploadsDir, (err, files) => {
        if(err) {
            return res.send('No files found');
        }
        let name = false;

        files.forEach( (file, key) => {
            if ( file === fileName  ) name = file;
        });

        if( !name )
            res.send('File not found');
        else
            res.sendFile(name, { root: uploadsDir }, (err) => {
                if (err) throw err;
            } )


    })
});


const getPerson = (personId) => {
  //  console.log('name --------------------------------------------------------------------------------------------------------------');
    const options = {
        uri: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/friends/persons/' + personId,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '85f31ab908714e0893cbf82faee8b026'
        }
    };
    request.get(options, (error, responce, body) => {
        console.log('name ------------------------------');

        const obj = JSON.parse(body);
        console.log(obj);
        if (obj.hasOwnProperty('name')) {

            const name = obj.name;
            console.log(name);
            return {
                namePerson: name
            };
        }
        return {error: 'person not found'};
    });
}


router.post('/achref',  (req,res) => {
    try {
        var filePath;
        var fileName;
        var form = new formidable.IncomingForm();
        form.uploadDir = './uploads';
        form.keepExtensions = true;
        form.type = true;
        form.on('fileBegin', function (name, file) {
            const extentionTab = file.type.split('/');
            const extention = extentionTab[1];
            file.path = __dirname + '\\..\\uploads\\' + index + '.png' ;//+ extention;
            file.type = 'image/png';
            file.name = index + '.png';
            filePath = file.path;
            fileName = file.name;
            console.log(file);
            index = uuid();
        });
        form.parse(req, (err, fields, files) => {

            if (err) throw err;

            /*
            fs.readdir('C:\\Users\\Shiro\\Desktop\\bioit\\bio\\uploads',function (err,files) {
                if(err) throw err;
                files.forEach( (file) => {
                    console.log(file);

                } )
            } );
            */

            /*
                        jimp.read(filePath).then(data => {
                           if (err) throw err;
                           data.resize(256,256)
                               .quality(60)
                               .greyscale()
                               .write(filePath);
                        }).catch(err => console.log(err));
            */
            //    blobService.createAppendBlobFromLocalFile('bioit',filename+'.png',filePath, (err3, result, responce3) => {
            //    });


                    const imageUrl = 'https://i-remember.azurewebsites.net/image/'+fileName ;
                    const options = {
                        uri: process.env.FACE_API_HOST+'detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_01&returnRecognitionModel=false&detectionModel=detection_01',
                        headers: {
                            'Content-Type': 'application/json',
                            'Ocp-Apim-Subscription-Key' : process.env.FACE_API_KEY
                        },
                        body: '{"url": ' + '"' + imageUrl + '"}'
                    };

                    request.post(options, (error, responce, body) => {

                        if (body){
                            console.log(body);
                            const object = JSON.parse(body);

                            if(object.hasOwnProperty('error')){
                                res.statusCode = 300;
                                res.json({});
                                return 0 ;
                            }

                            if (object.length === 0){
                                res.statusCode = 300;
                                res.setHeader('error','not a person');
                                res.json({error: 'person not found'});
                                index = uuid();
                                return 0;
                            }
                            const array = object[0];
                            if(!array.hasOwnProperty('faceId')){
                                res.statusCode = 300;
                                res.json({});
                                return 0 ;
                            }
                            const {faceId} = array;

                            if(!faceId){
                                res.statusCode = 300;
                                res.json({});
                                return 0 ;
                            }

                      //      console.log(object);

                            //  console.log(faceID);
                            const a = '{"personGroupId": "friends", "faceIds": [ "'+ faceId+'"  ],  "maxNumOfCandidatesReturned": 1,  "confidenceThreshold": 0.5}';
                            const op = {
                                uri: process.env.FACE_API_HOST+'identify',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Ocp-Apim-Subscription-Key' : process.env.FACE_API_KEY
                                },
                                body: a
                            };
                            request.post(op, (error2, responce2, body2) => {
                                if (error2) {
                                    console.log(error);
                                    res.json({error: 'detecting person error'});
                                    index= uuid();
                                }
                                if (body2) {
                                    console.log(body2);
                                    const obj = JSON.parse(body2);
                                    const a = obj[0];
                                    const {candidates} = a;

                                    //check

                                    if (candidates.length === 0) {
                                        res.statusCode = 301;
                                        res.setHeader('error', 'cant recognize');
                                        res.json({error: 'user not found'});
                                        index = uuid();
                                        return 0;
                                    }
                                    const o = candidates[0];
                                    console.log('---------------------------------------------------------------------------------------------------------');
                                    candidates.forEach( person => {
                                        console.log(person);
                                    } );
                                    const {personId} = o;
                                    if(!personId) {
                                        res.statusCode = 300;
                                        res.setHeader('error','person not found');
                                        res.json({error: 'person not found'});
                                        index = uuid();
                                        return 0;
                                    }
                                    console.log(personId);

                                    const options3 = {
                                        uri: process.env.FACE_API_HOST+'persongroups/friends/persons/'+personId,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Ocp-Apim-Subscription-Key' : process.env.FACE_API_KEY
                                        }};

                                    request.get(options3, (error3, responce3, body3) => {

                                        const obj = JSON.parse(body3);
                                        console.log(obj);
                                        if ( obj.hasOwnProperty('name') )
                                        {
                                            const personObject = {name:obj.name, userData: obj.userData};
                                            //  console.log(namee);



                                            try {
                                                const options = {
                                                    uri: 'https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issueToken',
                                                    headers: {
                                                        'Ocp-Apim-Subscription-Key': process.env.SPEECH_API_KEY,
                                                        'Host': 'westeurope.api.cognitive.microsoft.com',
                                                        'Content-type': 'application/x-www-form-urlencoded',
                                                        'Content-Length': 0
                                                    }
                                                };

                                                request.post(options, (errToken,responceToken,bodyToken) => {
                                                    const token = bodyToken;
                                                    speech.textToSpeechForIdentification(token, res, personObject);
                                                    index = uuid();
                                                    return 0 ;
                                                });
                                                //  res.json({});

                                            }catch (e) {
                                                console.log(e);
                                            }

                                        } else {
                                            res.statusCode = 301;
                                            res.json({error: 'user not found'});
                                            index = uuid();
                                            return 0;
                                        }
                                        //  res.json({error: 'person not found'});
                                    });
                                }
                            });
                        }
                        if (error){
                            console.log(error);
                            res.statusCode = 404;
                            res.json({error: 'identifing person error'});
                            index = uuid();
                            return 0;
                        }
                    });
                
        });
    }catch (e) {
        console.log(e.message);
        console.log(error);
        res.statusCode = 500;
        res.json({error: 'unknown error'});
        index = uuid();
        return 0;
    }
});














function getListByDay(day){
    let responce = [];

    for(key in tasks){
        // console.log(key+"    " +tasks[key]);
        if(tasks[key].day === day){
            responce.push(tasks[key]);
        }

    }
    return responce;
}


router.get('/getByDay/:day', function(req, res, next) {

    const {day} = req.params;

    if(!day){
        res.statusCode = 400;
        res.send();
        return 0 ;
    }else {
        tasksService.getByDay(day,res);
    }

});

router.get('/getAll', function(req, res, next) {
    tasksService.getAll(res);
});

router.get('/setDone/:id', function(req, res, next) {

    const {id} = req.params;

    if(!id){
        res.statusCode = 400;
        re.send();
    }
    else{
        tasksService.setDone(id);
        res.statusCode=200;
        res.send();
    }

});



router.post('/addTask', function(req, res, next) {

    // console.log(req.body);
    try {
        const {task} = req.body;

        if (!task) throw new Error('task is not valid');

        tasksService.addTask(task);
        res.json({});

    }catch (e) {
        console.log(`Error ${e.message}`);
        res.statusCode = 400;
        res.setHeader('error',e.message);
        res.send();
    }
});


router.get('/setUndone/:id', function(req, res, next) {


    const {id} = req.params;

    if(!id){
        res.statusCode = 400;
        re.send();
    }
    else{
        tasksService.setUndone(id);
        res.statusCode=200;
        res.send();
    }

});


router.post('/delete/:id', function(req, res, next) {


    const {id} = req.params;

    if(!id){
        res.statusCode = 400;
        re.send();
    }
    else{
        tasksService.deleteTask(id);
        res.statusCode=200;
        res.send();
    }

});



var lists = {"lists" : [
    {
        "title":"Changes in Behavior and Communication",
        "list":[
            {
                "title":"Communication and Behavior Problems: Resources for Alzheimer's Caregivers",
                "description":"Caregivers face a variety of challenges when a loved one develops Alzheimer's disease or another dementia, including communicating with the memory-impaired person and responding to difficult behaviors. This resource list offers a selection of articles, books, videos, and other materials that may help.",
            },
            {
                "title":"Communicating with a Confused Patient",
                "description":"Here are some tips for effectively working with and communicating with cognitively impaired patients. Try to address the patient directly, even if his or her cognitive capacity is diminished.Gain the person's attention. Sit in front of and at the same level as him or her and maintain eye contact.",
            },
            {
                "title":"Coping with Agitation and Aggression in Alzheimer's Disease",
                "description":"People with Alzheimer’s disease may become agitated or aggressive as the disease gets worse. Agitation means that a person is restless or worried. He or she doesn’t seem to be able to settle down. Agitation may cause pacing, sleeplessness, or aggression, which is when a person lashes out verbally or tries to hit or hurt someone.",
            }
        ],
        "link":"https://www.nia.nih.gov/sites/default/files/styles/featured_resources/public/2017-07/behavior-changes-landing.jpg?h=f7b5df33&itok=YgYOSTxA"
    },
    {
        "title":"Everyday Care",
        "list":[
            {
                "title":"Going to the Hospital: Tips for Dementia Caregivers",
                "description":"A trip to the hospital can be stressful for people with Alzheimer’s disease or another dementia and their caregivers. Being prepared for emergency and planned hospital visits can relieve some of that stress. This article suggests ways to help you prepare and tips for making your visit to the emergency room or hospital easier.",
            },
            {
                "title":"Alzheimer's Disease: Common Medical Problems",
                "description":"These diseases spread quickly from one person to another, and people with Alzheimer's are more likely to get them. Make sure that the person gets a flu shot each year and a pneumonia shot once after age 65. Some older people need to get more than one pneumonia vaccine. The shots lower the chances that the person will get the flu or pneumonia. For more information on pneumonia, visit the Centers for Disease Control and Prevention (CDC). For more information on the flu, visit the CDC or the National Institute of Allergy and Infectious Diseases.",
            },
            {
                "title":"Finding Long-Term Care for a Person with Alzheimer's",
                "description":"You may feel guilty or upset about this decision, but moving the person to a facility may be the best thing to do. It will give you greater peace of mind knowing that the person is safe and getting good care.Choosing the right place is a big decision. It’s hard to know where to start. The following overview of options, along with questions to ask and other resources, can help you get started.",
},
],
"link":"https://www.nia.nih.gov/sites/default/files/styles/featured_resources/public/2017-07/everyday-care-landing.jpg?h=f7b5df33&itok=1gAqzzPi",
},
{
    "title":"Relationships and Alzheimer's",
    "list":[
    {
        "title":"Resources for Children and Teens About Alzheimer's Disease",
        "description":"When someone has Alzheimer's disease, it affects everyone in the family, including children and grandchildren. This resource list offers a selection of fiction and nonfiction books, articles, websites, and other materials that may help children and teenagers cope when a family member or friend has Alzheimer's. They can also help parents talk with their children about the disease.",
    },
    {
        "title":"Helping Kids Understand Alzheimer's Disease",
        "description":"When a family member has Alzheimer’s disease, it affects everyone in the family, including children and grandchildren. It’s important to talk to them about what is happening. How much and what kind of information you share depends on the child’s age and relationship to the person with Alzheimer’s.",
    },
    {
        "title":"Helping Family and Friends Understand Alzheimer's Disease",
        "description":"You can help family and friends understand how to interact with the person with Alzheimer’s disease. Here are some tips:Help family and friends realize what the person can still do and how much he or she still can understand Give visitors suggestions about how to start talking with the person. For example, make eye contact and say, “Hello George, I’m John. We used to work together.”",
},

],
    "link":"https://www.nia.nih.gov/sites/default/files/styles/featured_resources/public/2017-07/alzheimers-relationships-landing.jpg?h=f7b5df33&itok=A2afrp4t",
},
{
    "title":"Safety and Alzheimer's",
    "list":[
    {
        "title":"",
        "description":"",
    },
],
    "link":"https://www.nia.nih.gov/sites/default/files/styles/featured_resources/public/2017-07/safety-landing.jpg?h=f7b5df33&itok=vlsu2BnL",
},
{
    "title":"Caregiver health",
    "list":[
    {
        "title":"",
        "description":"https://www.nia.nih.gov/sites/default/files/styles/featured_resources/public/2017-07/caregiver-health-landing.jpg?h=f7b5df33&itok=bXDVdVLD",
    },
],
    "link":"",
},
{
    "title":"Legal and Financial Issues",
    "list":[
    {
        "title":"",
        "description":"",
    },
],
    "link":"https://www.nia.nih.gov/sites/default/files/styles/featured_resources/public/2017-07/legal-financial-issues-landing.jpg?h=f7b5df33&itok=TRu55xWK",
}

]};

router.get('/lists', function(req, res, next) {
    res.statusCode = 200;
    res.json(lists);
});

router.post('/persons', function(req, res, next) {


    const options = {
        uri: process.env.FACE_API_HOST+'persongroups/friends/persons',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : process.env.FACE_API_KEY
        },body: '{"name":"'+req.headers.name+'" , "userData": "'+req.headers.userdata+'"}'
    };
    //console.log(req.headers)
    //console.log(options);


    request.post(options, (error, responce, body) => {

       if(body){
           console.log(body)
           res.json(body);

       }


    });


});




router.get('/persons', function(req, res, next) {

    const options = {
        uri: process.env.FACE_API_HOST+'persongroups/friends/persons?start=1&top=1000',
        headers: {
            'Ocp-Apim-Subscription-Key' : process.env.FACE_API_KEY
        }
    };


    let persons = [];

    request.get(options, (error, responce, b) => {

        const body = JSON.parse(b);
        if(body){
            console.log(body);
            for (let dataKey in body) {
                let obj = {name: body[dataKey].name, id: body[dataKey].personId};
                persons.push(obj);
            }
            res.json({persons: persons});
        }

    });



});



router.post('/uploadImage/:id', function(req, res, next) {





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
    });



    form.parse(req, (err, fields, files) => {

        if(err) throw err;

        //   fs.rename(files.image.path, './uploads/'+files.image.name, (err) => {if (err) throw err;});
        console.log('Fields');
        //  console.log(fields);
        console.log('Files');
        //  console.log(files.file);

    });


    const personId = req.params.id;

    const imageUrl = 'https://i-remember.azurewebsites.net/image/'+index+'.png' ;
 //   const imageUrl = 'https://bioit.blob.core.windows.net/bioit/'+index+'.jpg' ;

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
            res.statusCode = 404;
            res.json({error: 'error'});
            index = uuid();
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
                res.statusCode = 400;
                res.send();
                index = uuid();
                return 0;
            }else {
                res.statusCode = 200;
               res.send();
                index = uuid();
                return 0;
            }
        });

    });

    // storage.ref().child('image').put();





});

router.get('/objects', function(req, res, next) {

 const o =   {"objects"	:[
        {	"name":"Medicaments",
            "localisation":"In the medicine cabinet , in the bathroom",
            "link":"https://www.containerstore.com/catalogimages/354039/HowToOrganizeYourMedicineCabinet_120.jpg?width=1200&height=1200&align=center"
        },
        {	"name":"Glasses",
            "localisation":"In the night stand , in my bedroom",
            "link":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJKIzoJLvYuV80gMUjpiiP_O11xASwMafY01i3JUP4XsZef5Be&s"
        },
        {	"name":"Clothes",
            "localisation":"In my bedroom closet",
            "link":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4lSA8Xpm0RKLpKzc7MuumgmMU4CubQG5XUx_TFlkuW3LWmlzE&s"
        }
    ]
    };

 res.statusCode = 200;
 res.json(o);





});

router.post('/speech', function(req, res, next) {

    console.log(req.body);
    const {text} = req.body;

    if(!text) throw new Error('no text provided');


    try {
        const options = {
            uri: 'https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issueToken',
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.SPEECH_API_KEY,
                'Host': 'westeurope.api.cognitive.microsoft.com',
                'Content-type': 'application/x-www-form-urlencoded',
                'Content-Length': 0
            }
        };

        request.post(options, (err,responce,body) => {
            const token = body;
            speech.textToSpeech(token, res,text);
            return 0 ;
        });
      //  res.json({});



    }catch (e) {
        console.log(e);
        res.json({});
    }

});

router.post('/location', function(req, res, next) {

    const {longitude,latitude} = req.body;

    if(!longitude || !latitude) {
        res.statusCode = 400;
        res.send();
        return 0;
    }else{
        locationService.setLocation({lat:latitude,long:longitude});
        res.statusCode = 200;
        res.send();
    }
});

router.get('/location', function(req, res, next) {

    locationService.getLocation(res);

});







module.exports = router;
