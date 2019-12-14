var mongoose =require('mongoose');

const uri = "mongodb+srv://redwalls:redwalls@cluster0-jivu8.azure.mongodb.net/IRemember?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});


const memorySchema = new mongoose.Schema({
    pictureId: {
        type: String,
        unique: true,
    },
    pictureUrl: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    date: {
        type: String
    }
});

const memoryModel = mongoose.model('memories', memorySchema);



const getAllMemoriesMongoose = async (res) => {
    const query =  memoryModel.find();
    const promise = query.exec();
    promise.then(data => {
        var memoriesAll = [];

        data.forEach(memory => {
            let {pictureId,pictureUrl,title,description,date} = memory;
            let obj ={
                pictureId: pictureId,
                pictureUrl:pictureUrl,
                title:title,
                description:description,
                date:date
            };
            memoriesAll.push(obj);
        });
        res.statusCode=200;
        res.json({
            pictures: memoriesAll
        });
        return 0;
    }).catch(err => {
       res.statusCode=400;
       res.json({});
       return 0;
    });

}

const addMemoryMongoose = (memory) => {
    const mem = new memoryModel(memory);
    mem.save(err => {

    });
}


exports.getAllMemories = getAllMemoriesMongoose;
exports.addMemory = addMemoryMongoose;

