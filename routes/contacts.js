var mongoose =require('mongoose');

const uri = "mongodb+srv://RedWalls:Redwalls123@cluster0-zesmx.azure.mongodb.net/IRemember?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser: true});



const contactsSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    number: {
        type: Number
    },
    imageURL: {
        type: String
    },
    imageId: {
        type: String
    }
});

const contactsModel = new mongoose.model('contacts',contactsSchema);



const addContact = (contactObject) => {

    const a = new contactsModel( contactObject );
    a.save(err => { });

};

const deleteContact = (id, res) => {


    const promise =  contactsModel.deleteOne({number: id},{}, err => {
        if (err){
            res.statusCode = 400;
            res.send();
            return 0;
        }else {
            res.statusCode = 200;
            res.send();
            return 0;
        }
    });

};


const getAllContacts = (res) => {

   const promise = contactsModel.find().exec();
   promise.then( data => {

       res.statusCode = 200;
       res.json( { contactsList: data } );

   } ).catch( err => {

       res.statusCode = 400;
       res.send();

   } )

} ;

exports.addContact = addContact;
exports.deleteContact =deleteContact;
exports.getAllContacts = getAllContacts;

