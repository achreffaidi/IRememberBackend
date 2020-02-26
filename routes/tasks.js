
var mongoose =require('mongoose');


const voicesService = require('./speech');
const xmlbuilder = require('xmlbuilder');
var uuid = require('uuid');
var index = uuid();
const fs = require('fs');
const request = require('request');
// Requires request and request-promise for HTTP requests
// e.g. npm install request request-promise
const rp = require('request-promise');
const readline = require('readline-sync');



const uri = "mongodb+srv://RedWalls:Redwalls123@cluster0-zesmx.azure.mongodb.net/IRemember?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});

var length  = 1000 ;




const taskSchema = new mongoose.Schema({
    time: {
        type: String
    },
    day: {
        type: Number
    },
    done: {
        type: Boolean,
        default: false
    },
    title: {
        type: String
    },
    imageURL: {
        type: String,
        default: null
    },
    imageId: {
        type: String
    },
    priority: {
        type: Number
    },
    description: {
        type: String
    },
    voiceLink: {
        type: String
    },
    voice: {
        type: String
    },
    name: {
        type:String
    },
    category: {
        type: String
    }
});

const tasksModel = mongoose.model('tasksVoice', taskSchema);

const voiceModel = voicesService.voiceModel;



function getAccessToken(subscriptionKey) {
    let options = {
        method: 'POST',
        uri: 'https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    }
    return rp(options);
};

function textToSpeech(accessToken, text, voice, name) {

   // console.log(voice);
    // Create the SSML request.
    let xml_body = xmlbuilder.create('speak')
        .att('version', '1.0')
        .att('xml:lang', voice.Locale)
        .ele('voice')
        .att('xml:lang', voice.Locale)
        .att('name', voice.Name)
        .txt(text)
        .end();
    // Convert the XML into a string to send in the TTS request.
    let body = xml_body.toString();

    let options = {
        method: 'POST',
        baseUrl: 'https://westeurope.tts.speech.microsoft.com/',
        url: 'cognitiveservices/v1',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'User-Agent': 'YOUR_RESOURCE_NAME',
            'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
            'Content-Type': 'application/ssml+xml'
        },
        body: body
    }


    let request = rp(options)
        .on('response', (response) => {
            if (response.statusCode === 200) {
                request.pipe(fs.createWriteStream('D:/home/site/wwwroot/speech/'+name));
              //  request.pipe(fs.createWriteStream(index+'.mp3'));

                console.log('\nYour file is ready.\n')
            }
        });
    return request;
}

const  createVoice= async (text, voiceName, name) => {
  //  console.log(voiceName)
    // Reads subscription key from env variable.
    // You can replace this with a string containing your subscription key. If
    // you prefer not to read from an env variable.
    // e.g. const subscriptionKey = "your_key_here";
    const subscriptionKey = process.env.SPEECH_API_KEY;
    if (!subscriptionKey) {
        throw new Error('Environment variable for your subscription key is not set.')
    };
    // Prompts the user to input text.

  //  console.log(text);

    try {
        const accessToken = await getAccessToken(subscriptionKey);
        await textToSpeech(accessToken, text,voiceName, name);
    } catch (err) {
        console.log(`Something went wrong: ${err}`);
    }
};




const addMongoose = async (taskObject) => {




    const voice = await  voicesService.voiceModel.find();
    taskObject.voice = voice[0].ShortName;
    //console.log(voice);


    await createVoice(taskObject.title+ ' . ' + taskObject.description, voice[0], index+'.mp3');

    taskObject.voiceLink = 'https://i-remember2.azurewebsites.net/speech/'+index+'.mp3';
    taskObject.name = index+'.mp3';

   // console.log(taskObject);

    const t = new tasksModel(taskObject);

    console.log('final object');
    console.log(t);
    t.save( err => {
        console.error(err);
    } );
    index = uuid();




};

const getAllMongoose = async (res) => {
    console.log('getAll');
    var tasksByDay = [];

    const query = tasksModel.find().sort({time: 1});
    const p = query.exec();
    p.then(data => {
      //  console.log(data);

        data.forEach(task => {

            tasksByDay.push(task);
        });

        res.statusCode=200;
        res.json({
            listByDay:  tasksByDay
        });
        return 0;
    }).catch(err => {
        res.statusCode=404;
        console.log(err);
        res.send();
        return 0;
    })

};

const setDoneMongoose = async (id) => {
    const doc = await tasksModel.findOneAndUpdate({_id: id},{done: true});
    console.log(doc);
};

const setUndoneMongoose = async (id) => {
    const doc = await tasksModel.findOneAndUpdate({_id: id},{done: false});
    console.log(doc);
};

const getTasksByDayMongoose = async (day,res) => {

    var tasksByDay = [];

    const query = tasksModel.find({day: day}).sort({time: 1});
    const p = query.exec();
    p.then(data => {
     //   console.log(data);

        data.forEach(task => {


            tasksByDay.push(task);
        });

        res.statusCode=200;
        res.json({
          listByDay:  tasksByDay
        });
        return 0;
    }).catch(err => {
        res.statusCode=404;
        console.log(err);
        res.send();
        return 0;
    })
}

const deleteTaskMongoose = async (id,taskObject) => {
    const promise =  tasksModel.deleteOne({_id: id},taskObject, err => {
        if (err) throw new Error();
    });
};


const getTaskStatByDay = (res,day) => {


  const allByDay = tasksModel.find( { day: day } ).exec();
  allByDay.then( all => {

    //  console.log(all);
      const doneByDay = all.filter( task => task.done === 'true' || task.done === true );

      const byPriority0 = all.filter( task => task.priority === 0 );
      const byPriority0Done = byPriority0.filter( task => task.done === 'true' || task.done === true );
      const byPriority1 = all.filter( task => task.priority === 1 );
      const byPriority1Done = byPriority1.filter( task => task.done === 'true' || task.done === true );
      const byPriority2 = all.filter( task => task.priority === 2 );
      const byPriority2Done = byPriority2.filter( task => task.done === 'true' || task.done === true );

      res.statusCode = 200;

      res.json( {
          tasksStat: {
              allTasks: {
                  all: all.length,
                  done: doneByDay.length,
              },
              priority0: {
                 all: byPriority0.length,
                  done: byPriority0Done.length
              },
              priority1: {
                  all: byPriority1.length,
                  done: byPriority1Done.length
              },
              priority2: {
                  all: byPriority2.length,
                  done: byPriority2Done.length
              }
          }
      } );

  } ).catch( err => {
      res.statusCode = 400;
      res.send();
  } );


};

exports.addTask = addMongoose;
//exports.addTask = main;
exports.getAll = getAllMongoose;
exports.setDone=setDoneMongoose;
exports.setUndone=setUndoneMongoose;
exports.getByDay=getTasksByDayMongoose;
exports.deleteTask=deleteTaskMongoose;
exports.tasksModel=tasksModel;
exports.getTaskStatByDay = getTaskStatByDay;