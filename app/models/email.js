var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var EmailSchema = new Schema({
    email: { type: String, required: true, trim: true, lowercase: true }
  });

EmailSchema.virtual('date')
  .get(function() {
    return this._id.getTimestamp();
  });

var Email = mongoose.model( 'Email', EmailSchema );

EmailSchema.pre( 'save', function( next ) {
  var self = this;

  Email.findOne( { email: self.email }, function( err, doc ) {
    if ( !doc ) {
      next();
    } else {
      next( new Error( 'email exists: ' + self.email ) );
    }
  });
});
