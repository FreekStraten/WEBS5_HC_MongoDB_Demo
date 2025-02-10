// models/teacher.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Definieer het teacher schema met properties, validaties en settings voor virtuals
var teacherSchema = new Schema({
    _id: { type: String, required: true, lowercase: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    age: { type: Number, min: 0, max: 100 },
    isActive: { type: Boolean },
    // Voeg de pseudo-join toe door 'ref' op te geven voor courses:
    courses: [{ type: String, required: true, ref: 'Course' }]
}, {
    // Zorgt ervoor dat virtuals (berekende eigenschappen) worden meegegeven bij toJSON/toObject
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// Extra validatie: de achternaam mag niet gelijk zijn aan de voornaam
teacherSchema.path('lastName').validate(function(val) {
    return val && this.firstName !== val;
}, 'Last name must differ from first name.');

// Virtual property voor de volledige naam
teacherSchema.virtual('fullName').get(function() {
    var fullName = this.firstName + ' ';
    if (this.middleName && this.middleName.length) {
        fullName += this.middleName + ' ';
    }
    fullName += this.lastName;
    return fullName;
});

// Custom query helper: pagination
teacherSchema.query.byPage = function(pageSize, pageIndex) {
    return this.find()
        .limit(parseInt(pageSize))
        .skip(pageIndex * pageSize);
};

// Custom query helper: sorteren op voornaam
teacherSchema.query.byName = function() {
    return this.find().sort({ firstName: 1 });
};

// Middleware: voer logica uit voor het opslaan
teacherSchema.pre('save', function(next) {
    console.log('Teacher will be saved');
    next();
    console.log('Teacher is saved');
});

// Registreer het model en exporteer het
module.exports = mongoose.model('Teacher', teacherSchema);
