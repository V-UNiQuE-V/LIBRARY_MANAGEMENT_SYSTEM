import express from "express"
import {
    borrowedBooks,
    getBorrowedBooksByAdmin,
    recordBorrowedBook,
    returnBorrowBook,
} from "../controllers/borrowControllers.js"
import {
    isAuthenticated,
    isAuthorized,
} from "../middlewares/authMiddleWare.js"

const router = express.Router();


router.post("/record-borrow-book/:id", isAuthenticated, isAuthorized("Admin"), recordBorrowedBook);
router.get("/borrowed-books-by-user", isAuthenticated, isAuthorized("Admin"), getBorrowedBooksByAdmin);
router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);
router.put("/return-borrowed-book/:bookId", isAuthenticated, isAuthorized("Admin"), returnBorrowBook);

export default router;