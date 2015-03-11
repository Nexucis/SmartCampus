/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

//////////////////////////////////
//Definition of a schema /////////
//////////////////////////////////
var ObjectId = Schema.ObjectId;
console.log("model");

var Entity = new Schema({
    id: ObjectId,
    name: String,
    type: String,
    latitude: Number,
    longitude: Number,
    description: String,
    comments: [Comment],
    administrators: [Administrator],
    events: [Event],
    items: [Item],
    infos: [],
    schedule: [],
    voteValue : {type:Number, default:0},
    typeCrowdsourcing : String,
    identifiant: String
});

var Item = new Schema({
    id: ObjectId,
    name: {type: String},
    position: {type: String},
    room_number: {type: Number},
    Sensors_data: [Sensors_data],
    identifiant: Number,
    type: String,
    infos: [],
    description: String,
    show: Boolean
});

var Event = new Schema({
    id: ObjectId,
    name: {type: String, required: true},
    description: {type: String},
    date: {type: Date, default: Date.now}
});

var Sensors_data = new Schema({
    id: ObjectId,
    type: {type: String},
    position: {type: String},
    identifiant : String,
    mesure: [Mesure]
});

var Mesure = new Schema({
    id: ObjectId,
    date: {type: Date, default: Date.now},
    value: Number,
    unite: String
});

var Comment = new Schema({
    id: ObjectId,
    value: String,
    date: {type: Date, default: Date.now}
});

var Administrator = new Schema({
    id: ObjectId,
    name: String,
    first_name: String,
    login: String,
    password: String,
    entity: [{type: Schema.Types.ObjectId, ref: 'Entity'}]
});


var SensorsWireless = new Schema({
    id:ObjectId,
    name:String,
    latitude : Number,
    longitude : Number,
    clefAES:String

});


var SensorsWireless_Data = new Schema({
    id:ObjectId,
    name:String,
    temperature:Number,
    pression:Number,
    luminosite:Number,
    pluviometrie:Number,
    directionVent:String,
    humidite:Number,
    vitesseVent:Number,
    date:{type:Date, default:Date.now}
    
    
});

// models
var EventModel = mongoose.model('Event', Event);
var ItemModel = mongoose.model('Item', Item);
var EntityModel = mongoose.model('Entity', Entity);
var AdministratorModel = mongoose.model('Administrator', Administrator);
var CommentModel = mongoose.model('Comment', Comment);
var MesureModel = mongoose.model('Mesure', Mesure);
var Sensors_dataModel = mongoose.model('Sensors_data', Sensors_data);
var SensorsWirelessModel = mongoose.model('SensorsWireless', SensorsWireless);
var SensorsWirelessDataModel = mongoose.model('SensorsWireless_Data', SensorsWireless_Data);

console.log('import model');
