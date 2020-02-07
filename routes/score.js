
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
    points: {
        type: Number
    },
    date: {
        type: String
    }
});

const scoreModel = mongoose.model('scores', scoreSchema);

const addScore = (points,date,res) => {

    const score = new scoreModel({
        scoreId: index,
        points: points,
        date: date
    });

    console.log(score);
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

}

const getAllScores = async (res) => {

    const query = scoreModel.find();
    const promise = query.exec();
    promise.then(data => {
        var scoreList = [];

        data.forEach( score => {
            const {id,points,date} = score;
            scoreList.push({id: id, points: points,date:date});
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


}

exports.addScore = addScore;
exports.getAllScores = getAllScores;
