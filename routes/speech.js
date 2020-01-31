// Requires request and request-promise for HTTP requests
// e.g. npm install request request-promise
const rp = require('request-promise');
// Requires fs to write synthesized speech to a file
const fs = require('fs');
// Requires readline-sync to read command line inputs
const readline = require('readline-sync');
// Requires xmlbuilder to build the SSML body
const xmlbuilder = require('xmlbuilder');
const env = require('dotenv').config();
var uuid = require('uuid');



var index = uuid();




// Make sure to update User-Agent with the name of your resource.
// You can also change the voice and output formats. See:
// https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
const textToSpeechForIdentification  = (accessToken, res, person) => {

    try {
        // Create the SSML request.
        let xml_body = xmlbuilder.create('speak')
            .att('version', '1.0')
            .att('xml:lang', 'en-GB')
            .ele('voice')
            .att('xml:lang', 'en-GB')
            .att('name', 'Microsoft Server Speech Text to Speech Voice (en-GB, George, Apollo)')
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
        }


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
}


const textToSpeech  = (accessToken, res, text) => {

    try {
        // Create the SSML request.
        let xml_body = xmlbuilder.create('speak')
            .att('version', '1.0')
            .att('xml:lang', 'en-GB')
            .ele('voice')
            .att('xml:lang', 'en-GB')
            .att('name', 'Microsoft Server Speech Text to Speech Voice (en-GB, George, Apollo)')
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
        }


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
                    res.setHeader(  'voice', 'https://i-remember.azurewebsites.net/speech/'+speechName);
                    index = uuid();
                    res.send();
                    index = uuid();
                }
            });
        return request;
    }catch (e) {
        console.log(e);
    }
}


exports.textToSpeechForIdentification = textToSpeechForIdentification;
exports.textToSpeech = textToSpeech;
