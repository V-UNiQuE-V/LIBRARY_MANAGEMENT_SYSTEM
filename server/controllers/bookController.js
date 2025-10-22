import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js"
import { User } from "../models/userModel.js"
import { Borrow } from "../models/borrowModel.js"
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const addBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, quantity } = req.body;
    if (!title || !author || !description || !price || !quantity) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }

    let book = await Book.findOne({ title });

    if (book) {
        const quantityToAdd = Number(quantity) || 0;
        book.quantity += quantityToAdd;
        await book.save();
        res.status(200).json({
            success: true,
            message: `The book already exists. Quantity updated to ${book.quantity}.`,
            book,
        });
    } else {
        const newBook = await Book.create({
            title,
            author,
            description,
            price,
            quantity,
        });
        res.status(201).json({
            success: true,
            message: "Book added successfully.",
            book: newBook,
        });
    }
});

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find();
    res.status(200).json({
        success: true,
        books,
    });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const book = await Book.findById(id);
    if(!book) {
        return next(new ErrorHandler("Book not found", 404));
    }
    
    // Remove all borrow records associated with this book
    await Borrow.deleteMany({ book: id });
    
    // Remove the book from all users' borrowedBooks arrays
    await User.updateMany(
        { "borrowedBooks.bookId": id },
        { $pull: { borrowedBooks: { bookId: id } } }
    );
    
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: "Book deleted successfully.",
    });
});