import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js"
import { Borrow } from "../models/borrowModel.js"
import { User } from "../models/userModel.js"
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { validateFields } from "../utils/validateFields.js";

export const addBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, quantity } = req.body;
    const validateFieldsError = validateFields({ title, author, description, price, quantity });
    if (validateFieldsError) {
        return next(new ErrorHandler(validateFieldsError, 400));
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
    const books = await Book.find().lean();
    res.status(200).json({
        success: true,
        books,
    });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const book = await Book.findByIdAndDelete(id);
    if(!book) {
        return next(new ErrorHandler("Book not found", 404));
    }
    
    // Delete all borrow records for this book
    await Borrow.deleteMany({ book: id });
    
    // Remove book from all users' borrowedBooks array
    await User.updateMany(
        { "borrowedBooks.bookId": id },
        { $pull: { borrowedBooks: { bookId: id } } }
    );
    
    res.status(200).json({
        success: true,
        message: "Book deleted successfully.",
    });
});