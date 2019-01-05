var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var blockSchema = new Schema({
    start_time: { type: Number, required: true, unique: true},//Minutes SINCE 00:00
    end_time: { type: Number, required: true, unique: true},
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

blockSchema
    .virtual('duration_h')
    .get(function(){
        return (this.end_time - this.start_time)/60;
    })

blockSchema
    .virtual('duration_m')
    .get(function(){
        return (this.end_time - this.start_time);
    })

blockSchema
    .virtual('start')
    .get(function(){
        return this.start_time/60;
    })

blockSchema
    .virtual('end')
    .get(function(){
        return this.end_time/60;
    })

blockSchema
  .virtual('start_hour')
  .get(function(){
    return Math.floor(this.start_time / 60);
  })

blockSchema
  .virtual('start_minute')
  .get(function(){
    return this.start_time % 60;
  })

blockSchema
  .virtual('end_hour')
  .get(function(){
    return Math.floor(this.end_time / 60);
  })


blockSchema
  .virtual('end_minute')
  .get(function(){
    return this.end_time % 60;
  })

var Block = mongoose.model('blocks', blockSchema);
module.exports = Block;

//TODO: Buddy id als referenz hinzufügen
