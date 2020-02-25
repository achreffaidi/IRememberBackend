
var mongoose =require('mongoose');
var uuid = require('uuid/v4');
var index = uuid();


const uri = "mongodb+srv://RedWalls:Redwalls123@cluster0-zesmx.azure.mongodb.net/IRemember?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});


const scoreSchema = new mongoose.Schema({
    scoreId: {
        type: String,
        unique: true
    },
    rapport: {
        type: Number
    },
    date: {
        type: Date
    },
    questionsNumber:{
        type: Number
    },
    correct:{
        type: Number
    }
});

const scoreModel = mongoose.model('scores', scoreSchema);

const addScore = (questionsNumber, correct,date,res) => {

    const score = new scoreModel({
        scoreId: index,
        questionsNumber: questionsNumber,
        date: date,
        correct: correct,
        rapport:   correct / questionsNumber
    });

  //  console.log(score);
    index = uuid();
    score.save(err => {
        if (err){
            console.log(err.message);
            res.statusCode = 400;
            res.send();
            return 0 ;
        }else {
            res.statusCode = 200;
            res.send();
            return 0 ;
        }
    })

};

const getAllScores = async (res) => {

    const query = scoreModel.find();
    const promise = query.exec();
    promise.then(data => {
        var scoreList = [];

        data.forEach( score => {
            const {rapport,date} = score;
            scoreList.push({rapport: rapport,date:date});
        } );
        res.statusCode = 200;
        res.json({
            scoreList: scoreList
        });
        return 0;

    }).catch(err => {
        console.log(err.message);
       res.statusCode = 400;
       res.send();
       return 0;
    });


};

const getLastestScore = (res) => {

    const p = scoreModel.find().sort(  'date' ).exec();

    p.then( data => {
        //console.log(data);
        res.statusCode = 200;
        res.json( {
            lastScore: data[data.length - 1]
        } );
    } ).catch( err => {
        //console.log(err);
        res.statusCode = 400;
        res.send();
    } )


}

exports.addScore = addScore;
exports.getAllScores = getAllScores;
exports.getLastestScore =getLastestScore;
