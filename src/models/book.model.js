const mongoose= require('mongoose')

const bookSchema=new  mongoose.Schema(
    {
        title:String ,
        author:String,
        genre:String,
        publication_date:String
    }
)


//exportamos el schema del libro como mongo model
module.exports=mongoose.model('Book',bookSchema)