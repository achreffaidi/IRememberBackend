const request = require('request');

let subscriptionKey = process.env.BING_IMAGE_KEY;
let path = process.env.BING_IMAGE_ENDPOINT;


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

exports.imageLinks = imageLinks;
