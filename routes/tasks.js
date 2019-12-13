var MongoClient = require('mongodb').MongoClient;
var mongoose =require('mongoose');


const uri = "mongodb+srv://redwalls:redwalls@cluster0-jivu8.azure.mongodb.net/IRemember?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});

var length ;

const connectDb = () => {
    return mongoose.connect(uri);
};

const add = (taskObject) => {
    try {
        client.connect(err => {
            const collection = client.db("IRemember").collection("tasks");
            collection.insert(taskObject);
            client.close();
        });
    }catch (e) {
        console.log(e.message);
    }
};


const taskSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    time: {
        type: String
    },
    day: {
        type: Number
    },
    done: {
        type: Boolean
    },
    title: {
        type: String
    }
});

const tasksModel = mongoose.model('tasks', taskSchema);

const addMongoose = (taskObject) => {

    length++;
    taskObject.id = length;

    const t = new tasksModel(taskObject);
   // console.log(t);
    t.save( err => {

    } );
};

const getAllMongoose = async (res) => {
    var allTasks = [];
    const query = tasksModel.find();
    const p = query.exec();
    p.then( data => {
        console.log(data);
        length=data.length;
        data.forEach(task => {
        let  {id,day,time,title,done} = task;
        let obj = {
            id: id,
            day: day,
            time: time,
            title:title,
            done: done
        };
        allTasks.push(obj);
        });
        res.statusCode=200;
        res.json({
            list: allTasks
        });
        return 0;
    } ).catch( err => {
        console.log(err);
        res.statusCode=400;
        res.json({});
        return 0;
    } );

};

const setDoneMongoose = async (id) => {
    const doc = await tasksModel.findOneAndUpdate({id: id},{done: true});
    console.log(doc);
}

const setUndoneMongoose = async (id) => {
    const doc = await tasksModel.findOneAndUpdate({id: id},{done: false});
    console.log(doc);
}

const getTasksByDayMongoose = async (day,res) => {

    var tasksByDay = [];

    const query = tasksModel.find({day: day});
    const p = query.exec();
    p.then(data => {
        console.log(data);

        data.forEach(task => {
            let {id,title,time,done,day} = task;
            let obj = {
                title: title,
                id: id,
                time: time,
                done: done,
                day: day
            };
            tasksByDay.push(obj);
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

exports.addTask = addMongoose;
exports.getAll = getAllMongoose;
exports.setDone=setDoneMongoose;
exports.setUndone=setUndoneMongoose;
exports.getByDay=getTasksByDayMongoose;