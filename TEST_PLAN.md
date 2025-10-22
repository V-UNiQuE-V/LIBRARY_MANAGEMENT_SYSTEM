# Test Plan for Book Deletion Cascade and Feedback System

## Feature 1: Book Deletion Cascade

### Test Case 1: Delete a book with no borrowers
**Steps:**
1. Create a new book
2. Delete the book
3. Verify book is deleted from Books collection

**Expected Result:**
- Book should be deleted successfully
- No errors should occur

### Test Case 2: Delete a book with borrowed records
**Steps:**
1. Create a new book
2. Create a user
3. Borrow the book for the user
4. Delete the book
5. Check Borrow collection for the book
6. Check User's borrowedBooks array

**Expected Result:**
- Book should be deleted from Books collection
- All Borrow records with this book should be deleted
- Book should be removed from all users' borrowedBooks arrays

### Test Case 3: Delete a book with returned and non-returned records
**Steps:**
1. Create a new book
2. Create multiple users
3. Some users borrow and return the book
4. Some users borrow but don't return
5. Delete the book
6. Verify all records are cleaned up

**Expected Result:**
- All borrow records (returned and non-returned) should be deleted
- Book should be removed from all users' borrowedBooks arrays

## Feature 2: Feedback System

### Test Case 1: Submit feedback as authenticated user
**Steps:**
1. Login as a user
2. Submit feedback with rating and comment
3. Check database for feedback entry

**Expected Result:**
- Feedback should be created successfully
- User information should be stored with feedback
- Response should confirm submission

### Test Case 2: Get all feedback as admin
**Steps:**
1. Login as admin
2. Call GET /api/v1/feedback/all
3. Verify all feedbacks are returned

**Expected Result:**
- All feedbacks should be returned
- Feedbacks should be sorted by creation date (newest first)

### Test Case 3: Get user's own feedback
**Steps:**
1. Login as a user
2. Submit multiple feedbacks
3. Call GET /api/v1/feedback/my-feedback
4. Verify only user's feedbacks are returned

**Expected Result:**
- Only the authenticated user's feedbacks should be returned
- Feedbacks should be sorted by creation date (newest first)

### Test Case 4: Delete feedback as admin
**Steps:**
1. Login as admin
2. Get a feedback ID
3. Call DELETE /api/v1/feedback/delete/:id
4. Verify feedback is deleted

**Expected Result:**
- Feedback should be deleted successfully
- Response should confirm deletion

### Test Case 5: Validation checks
**Steps:**
1. Submit feedback without rating
2. Submit feedback with rating < 1
3. Submit feedback with rating > 5
4. Submit feedback without comment

**Expected Result:**
- All invalid submissions should return 400 error
- Appropriate error messages should be returned

## API Endpoints

### Book Deletion
- DELETE /api/v1/book/delete/:id
  - Requires authentication
  - Requires Admin role
  - Cascades deletion to Borrow records and User borrowedBooks

### Feedback System
- POST /api/v1/feedback/submit
  - Requires authentication
  - Body: { rating, comment, category }
  
- GET /api/v1/feedback/all
  - Requires authentication
  - Requires Admin role
  
- GET /api/v1/feedback/my-feedback
  - Requires authentication
  
- DELETE /api/v1/feedback/delete/:id
  - Requires authentication
  - Requires Admin role

## Notes
- MongoDB configuration should not be affected
- Postman configs should remain unchanged
- All changes maintain backward compatibility
