// Requires request and request-promise for HTTP requests
// e.g. npm install request request-promise
const rp = require('request-promise');
// Requires fs to write synthesized speech to a file
const fs = require('fs');
// Requires readline-sync to read command line inputs
const readline = require('readline-sync');
// Requires xmlbuilder to build the SSML body
const xmlbuilder = require('xmlbuilder');

const tasksModel = require('./tasks');

var uuid = require('uuid');
const reque= require('request');
var mongoose =require('mongoose');

const uri = "mongodb+srv://RedWalls:Redwalls123@cluster0-zesmx.azure.mongodb.net/IRemember?retryWrites=true&w=majority";


var index = uuid();
mongoose.connect(uri, {useNewUrlParser: true});

const voiceSchema = mongoose.Schema({

    Name: String,
    ShortName: String,
    Gender: String,
    Locale: String,
    SampleRateHertz: String,
    VoiceType: String
});


const Voice =mongoose.model('Voice',voiceSchema);


// Make sure to update User-Agent with the name of your resource.
// You can also change the voice and output formats. See:
// https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
const textToSpeechForIdentification  = (accessToken, res, person) => {
    Voice.findOne({SampleRateHertz: '16000'}).exec().then(docs=>{
    try {
        // Create the SSML request.
        let xml_body = xmlbuilder.create('speak')
            .att('version', '1.0')
            .att('xml:lang', docs.Locale)
            .ele('voice')
            .att('xml:lang', docs.Locale)
            .att('name', docs.Name)
            .txt(person.name+' .   '+person.userData)
            .end();
        // Convert the XML into a string to send in the TTS request.
        let body = xml_body.toString();

        console.log(body);

        let options = {
            method: 'POST',
            baseUrl: 'https://westeurope.tts.speech.microsoft.com/',
            url: 'cognitiveservices/v1',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'cache-control': 'no-cache',
                'User-Agent': 'I-Remember',
                'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
                'Content-Type': 'application/ssml+xml'
            },
            body: body
        };


        const speechName = 'speech'+ index + '.mp3';

        let request = rp(options)
            .on('response', (response) => {
                if (response.statusCode === 200) {

             //       var stream = fs.createReadStream(fileNameTarget).pipe(FileService.createWriteStreamToNewFile(shareName, directoryName, fileName));

             console.log(process.cwd())
// C:\Project
//console.log(__dirname)

                    request.pipe(fs.createWriteStream('D:/home/site/wwwroot/speech/'+speechName));
                    console.log('\nYour file is ready.\n');

                            res.statusCode = 200;
                            res.setHeader(  'name', person.name);
                            res.setHeader(  'userData', person.userData);
                            res.setHeader(  'voice', 'https://i-remember2.azurewebsites.net/speech/'+speechName);
                            index = uuid();
                            res.json(person);
                            index = uuid();
                }
            });
        return request;
    }catch (e) {
        console.log(e);
    }
    }).catch(err =>{
        console.log(err);
        res.status(500).send(err);
    })
};


const textToSpeech  = async (accessToken, res, text) => {

    /*if (typeof voice === 'undefined')
    {
        voice = {
            "Name": "Microsoft Server Speech Text to Speech Voice (en-GB, George, Apollo)",
            "ShortName": "en-GB-George-Apollo",
            "Gender": "Male",
            "Locale": "en-GB",
            "SampleRateHertz": "16000",
            "VoiceType": "Standard"
        };
    }*/
    Voice.findOne({SampleRateHertz: '16000'}).exec().then(voice=>{
    try {
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

        console.log(body);

        let options = {
            method: 'POST',
            baseUrl: 'https://westeurope.tts.speech.microsoft.com/',
            url: 'cognitiveservices/v1',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'cache-control': 'no-cache',
                'User-Agent': 'I-Remember',
                'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
                'Content-Type': 'application/ssml+xml'
            },
            body: body
        };


        const speechName = 'game'+ index + '.mp3';

        let request = rp(options)
            .on('response', (response) => {
                if (response.statusCode === 200) {

                    //       var stream = fs.createReadStream(fileNameTarget).pipe(FileService.createWriteStreamToNewFile(shareName, directoryName, fileName));

                 //   console.log(process.cwd())
// C:\Project
//console.log(__dirname)

                    request.pipe(fs.createWriteStream('D:/home/site/wwwroot/speech/'+speechName));
                    console.log('\nYour file is ready.\n');

                    res.statusCode = 200;
                    res.setHeader(  'voice', 'https://i-remember2.azurewebsites.net/speech/'+speechName);
                    index = uuid();
                    res.send();
                    index = uuid();
                }
            });
        return request;
    }catch (e) {
        console.log(e);
    }
    }).catch(err =>{
        console.log(err);
        res.status(500).send(err);
    })
};

const listOfVoices = (req,res) => {

    const options = {
        uri: 'https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.SPEECH_API_KEY,
            'Host': 'westeurope.api.cognitive.microsoft.com',
            'Content-type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
        }
    };

    reque.post(options, (errToken,responceToken,bodyToken) => {

        const options2 = {
            url: 'https://westeurope.tts.speech.microsoft.com/cognitiveservices/voices/list',
            headers: {
                'Authorization' : 'Bearer '+bodyToken

            }
        };
        reque.get(options2,(err,resp,body)=>{

            var voices = []
            body= JSON.parse(body);
            var male=2 , fem=2;
            for (let elem of body ) {
                if(elem.SampleRateHertz === '16000' && elem.Locale.search("en")!==-1)
                {
                    if(elem.Gender === "Male" && male > 0)
                    {
                        male--;
                        voices.push(elem);
                    }
                    else if(elem.Gender === "Female" && fem > 0)
                    {
                        fem--;
                        voices.push(elem);
                    }
                    if(fem === male && male === 0)
                        break;
                }
            }
            res.json({list: voices});
        })
    })
}

const findVoice = (voiceShortname,res) =>{

    const options = {
        uri: 'https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.SPEECH_API_KEY,
            'Host': 'westeurope.api.cognitive.microsoft.com',
            'Content-type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
        }
    };

    reque.post(options, (errToken,responseToken,bodyToken) => {
        console.log(bodyToken);
        const options2 = {
            url: 'https://westeurope.tts.speech.microsoft.com/cognitiveservices/voices/list',
            headers: {
                'Authorization' : 'Bearer '+bodyToken

            }
        };
        reque.get(options2,(err,resp,body)=>{

            body= JSON.parse(body);

            for (let elem of body ) {
                if(elem.ShortName === voiceShortname)
                {
                    try {
                            textToSpeech(bodyToken, res,"This is a test example.",elem);
                            //  res.json({});
                    }catch (e) {
                        console.log(e);
                        res.json({});
                    }

                    break;
                }
            }

        });
    });

};

const getVoice =  (res)=>{
    Voice.findOne({SampleRateHertz: '16000'}).exec().then(docs=>{
        res.status(200).send(docs.ShortName);
    }).catch(err =>{
        console.log(err);
        res.status(500).send(err);
    })
};



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

function textToSpeechWithName(accessToken, text, voice, name) {

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
    try{
    const subscriptionKey = process.env.SPEECH_API_KEY;
    if (!subscriptionKey) {
        throw new Error('Environment variable for your subscription key is not set.')
    };
    // Prompts the user to input text.

    //  console.log(text);


        const accessToken = await getAccessToken(subscriptionKey);
        await textToSpeechWithName(accessToken, text,voiceName, name);
    } catch (err) {
        console.log(`Something went wrong: ${err}`);
    }
};





const updateTaskvoices = () => {

    const tasks = tasksModel.find().exec();

    tasks.then( data => {

        data.forEach( el => {

            const { name } = el;

            const voicePromise = Voice.find().exec();

            voicePromise.then(async voice => {

                await createVoice( el.title + ' . ' + el.description, voice, name );

            } ).catch( err => console.log(err) );

        } );

    } ).catch( err => {} );



}

const setVoice= (shortname,res)=>{

    const options = {
        uri: 'https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.SPEECH_API_KEY,
            'Host': 'westeurope.api.cognitive.microsoft.com',
            'Content-type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
        }
    };

    reque.post(options, (errToken,responseToken,bodyToken) => {
        console.log(bodyToken);
        const options2 = {
            url: 'https://westeurope.tts.speech.microsoft.com/cognitiveservices/voices/list',
            headers: {
                'Authorization' : 'Bearer '+bodyToken

            }
        };
        reque.get(options2,(err,resp,body)=>{

            body= JSON.parse(body);

            for (let elem of body ) {
                if(elem.ShortName === shortname)
                {
                    Voice.replaceOne({SampleRateHertz:'16000'},elem).exec().then(result=>{
                        res.send(result);
                    }).catch(err =>{
                        console.log(err);
                        res.send(err);
                    });

                }
            }


        })
    });

    updateTaskvoices();

};


exports.getVoice=getVoice;
exports.setVoice=setVoice;
exports.listOfVoices = listOfVoices;
exports.textToSpeechForIdentification = textToSpeechForIdentification;
exports.textToSpeech = textToSpeech;
exports.findVoice = findVoice;
exports.voiceModel = Voice;
