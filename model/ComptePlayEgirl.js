const mongoose = require('mongoose');


const ComptePlayEgirl = new mongoose.Schema({
  nombrePlay: Number
}, {
  timestamps: true,
});

//ajouter a la table message, les messages(name + message + timestamps)
module.exports = mongoose.model('ComptePlayEgirl', ComptePlayEgirl);
