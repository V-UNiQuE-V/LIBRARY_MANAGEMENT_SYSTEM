# New Features Documentation

## 1. Book Deletion with Cascade

### Overview
When a book is deleted from the library system, all related records are automatically cleaned up to maintain data integrity.

### What Gets Deleted
- The book itself from the Books collection
- All borrow records (returned and non-returned) from the Borrow collection
- The book reference from all users' borrowedBooks arrays

### API Endpoint
```
DELETE /api/v1/book/delete/:id
```

**Authentication Required:** Yes  
**Authorization Required:** Admin only

**Request Example:**
```bash
DELETE http://localhost:5000/api/v1/book/delete/507f1f77bcf86cd799439011
Headers:
  Cookie: token=<jwt-token>
```

**Response Example:**
```json
{
  "success": true,
  "message": "Book deleted successfully."
}
```

### Implementation Details
The `deleteBook` controller now performs three operations:
1. Deletes the book using `Book.findByIdAndDelete(id)`
2. Removes all borrow records using `Borrow.deleteMany({ book: id })`
3. Removes book from users' arrays using `User.updateMany()` with `$pull` operator

---

## 2. Customer Feedback System

### Overview
A complete feedback system that allows users to provide ratings and comments about the library service.

### Features
- Users can submit feedback with ratings (1-5 stars) and comments
- Feedback is categorized (General, Book Quality, Service, Website, Other)
- Users can view their own feedback history
- Admins can view all feedback and delete inappropriate submissions

### API Endpoints

#### Submit Feedback
```
POST /api/v1/feedback/submit
```

**Authentication Required:** Yes  
**Authorization Required:** Any authenticated user

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great service! The library has an excellent collection.",
  "category": "General"
}
```

**Validation:**
- `rating`: Required, must be between 1 and 5
- `comment`: Required, string
- `category`: Optional, one of: "General", "Book Quality", "Service", "Website", "Other"

**Response Example:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully.",
  "feedback": {
    "_id": "507f1f77bcf86cd799439011",
    "user": {
      "id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "rating": 5,
    "comment": "Great service! The library has an excellent collection.",
    "category": "General",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Feedback (Admin)
```
GET /api/v1/feedback/all
```

**Authentication Required:** Yes  
**Authorization Required:** Admin only

**Response Example:**
```json
{
  "success": true,
  "feedbacks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user": {
        "id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "rating": 5,
      "comment": "Great service!",
      "category": "General",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get My Feedback
```
GET /api/v1/feedback/my-feedback
```

**Authentication Required:** Yes  
**Authorization Required:** Any authenticated user

**Response Example:**
```json
{
  "success": true,
  "feedbacks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user": {
        "id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "rating": 5,
      "comment": "Great service!",
      "category": "General",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Delete Feedback (Admin)
```
DELETE /api/v1/feedback/delete/:id
```

**Authentication Required:** Yes  
**Authorization Required:** Admin only

**Request Example:**
```bash
DELETE http://localhost:5000/api/v1/feedback/delete/507f1f77bcf86cd799439011
Headers:
  Cookie: token=<jwt-token>
```

**Response Example:**
```json
{
  "success": true,
  "message": "Feedback deleted successfully."
}
```

### Database Schema

**Feedback Model:**
```javascript
{
  user: {
    id: ObjectId (ref: User),
    name: String,
    email: String
  },
  rating: Number (1-5),
  comment: String,
  category: String (enum),
  timestamps: true
}
```

### Error Handling

All endpoints return proper error messages:

**Missing Fields:**
```json
{
  "success": false,
  "message": "Please fill in all fields."
}
```

**Invalid Rating:**
```json
{
  "success": false,
  "message": "Rating must be between 1 and 5"
}
```

**Not Found:**
```json
{
  "success": false,
  "message": "Feedback not found"
}
```

**Unauthorized:**
```json
{
  "success": false,
  "message": "User not authenticated" // or "Admin access required"
}
```

---

## Testing

See `TEST_PLAN.md` for detailed test cases and scenarios.

## Notes

- All MongoDB configurations remain unchanged
- Postman collections can be extended with these new endpoints
- Authentication is handled through JWT tokens in cookies
- All endpoints follow the existing application patterns
