var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aulaSchema = new Schema({
materia: {
    name: String,
    aulas: [{
        numAula: String,
        quemFez: [
            
        ]
    }],
    
  }
    
});

module.exports = mongoose.model('Aula', aulaSchema);