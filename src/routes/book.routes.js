//get put patch post delete etc
const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')
//MIDDLEWARE
const getBook = async (req, res, next) => {
    let book
    //sacamos el id de los parametros que recibimos 
    const { id } = req.params
    //checkear que corresponde a un id valido
    //si  machea con el tipico id de mongo 
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: 'El ID del libro no es valido'
        })
    }
    //
    try {
        book = await Book.findById(id)
        if (!book) {
            return res.status(404).json({
                message: 'El libro no fue encontrado'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
    res.book = book
    //con el next continua 
    next()
}

//Obtener todos los libros [GET ALL]
router.get('/', async (req, res) => {
    try {
        //con solo el find busca todos los books
        const books = await Book.find()
        console.log('Get All ', books);

        if (books.length === 0) {
            return res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Crear un nuevo libro (recurso) [POST]

router.post('/', async (req, res) => {
    //desestructuramos el body 
    const { title, author, genre, publication_date } = req?.body
    if (!title || !author || !genre || !publication_date) {
        return res.status(400).json({
            message: 'Los campos titulo,autor,genero y fecha de publicacion son obligatorios'
        })
    }
    const book = new Book({
        title,
        author,
        genre,
        publication_date
    })
    try {
        const newBook = await book.save()
        console.log(newBook);

        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

//get individual
router.get('/:id',getBook,async(req,res)=>{
    res.json(res.book)
})

//Modificar el libro--- se modifican todos los parametros[PUT]
router.put('/:id',getBook,async(req,res)=>{
    try {
        const book=res.book
        book.title=req.body.title || book.title
        book.author=req.body.author || book.author
        book.genre=req.body.genre || book.genre
        book.publication_date=req.body.publication_date || book.publication_date

        const updatedBook=await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

//Modifica parcialmente el libro (recurso) [PATCH]
router.patch('/:id',getBook,async(req,res)=>{
    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date) {
        res.status(400).json({
            message:'Al menos uno de estos campos debe ser enviado: Titulo, Autor, Genero, Fecha de Publicacion'
        })
    }
    try {
        const book=res.book
        book.title=req.body.title || book.title
        book.author=req.body.author || book.author
        book.genre=req.body.genre || book.genre
        book.publication_date=req.body.publication_date || book.publication_date

        const updatedBook=await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})
//Eliminar el libro [DELETE]
router.delete('/:id',getBook,async(req,res)=>{
    try {
        const book=res.book
        await book.deleteOne({
            _id:book._id
        })
        res.json({
            message:`El libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message:error.message 
        })
    }
})

module.exports= router 