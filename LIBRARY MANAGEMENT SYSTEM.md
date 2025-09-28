# LIBRARY MANAGEMENT SYSTEM



→ Frontend : React

→ Styling : Tailwind CSS

→ Backend : nodeJS , ExpressJS

→ Database : MogoDB





### REGISTRATION(signup page):



##### ▪ USER ACCOUNT REGISTRATION:



Username , Email , Password



After entering the above details, an OTP will be generated which will directly been sent to the users email id.



after verifying the OTP, the user will get logged in to the site.



###### DASHBOARD:



→ Infographics (pie-chart):

 	• Total Borrowed books

 	• Returned Books

→ password change facility.



###### BOOKS:



Here all the books that are available in the library will be listed.

The aspects that the list will be sorted will be:

* ID
* Name (Book name)
* Author
* Price (This price will be of 7 days)
* Availability



Search facility will also be provided to the user.



###### BORROWED BOOKS:



Here, this will consists of 2 aspects:

 	• Returned Books

 	• Non-Returned Books



This will basically sort all those books that are borrowed and returned by the user and also those books which are borrowed but not returned yet.



Aspects:

* ID
* Book Title
* Date \& time (When the user has taken the book)
* Due date (Date of returning the book which will be 7 days after the book was borrowed)
* Returned Status (Yes/No)
* View (Show the book title , author , book description)



##### ▪ ADMIN LOGIN:



**DOUBT - aagar fresh site hai so admin ko login karne ke liye signup page se register karna padega to usske liye bhi same aspects hoge (used for user account registration) account register karva ne ke liye ki kuch aalag hoga?**



So after registration, the admin will login using his email and password.



###### DASHBOARD:



→ Profile Picture
→ User count

→ total book count

→ Admin count (total members that are ADMIN)

→ Pie chart (Total books that are borrowed but not returned and Total number of books that are returned)

→ Password change facility



###### BOOKS:



Here all the books that are available in the library will be listed.

The aspects that the list will be sorted will be:

* ID
* Name (Book name)
* Author
* Price (This price will be of 7 days)
* Availability
* Record Book



Search facility will also be provided.

Admin will only be allowed to add the new books to the list.


* Book will be listed on the following aspects:
* Book title
* Book author
* Book price (price for borrowing)
* Quantity
* Description



**» Record Book functionality:**

Here there will be 2 buttons,

* First one will allow the admin to read the details of the book like **Book title , author , book description**.
* Second one will allow the admin to list the book to the user, this will only ask the user's email id, which after entering the book will be listed to the respective user.



###### CATALOG:

This will show the list of users which have returned the books and also who have not returned yet.

Consists of 2 section:

1. Borrowed books
2. Overdue books



BORROWED BOOKS:

Users who have returned the book will be shown which a checkbox showing a tick on it, and the users which are willing to return, admin will click a button which will show the email id of the user (for verification and cannot be edited) and when clicked "Return" button the user will get a checkbox icon after him in the list (which means that the user has returned the book).



OVERDUE BOOKS:

this will show the books that have passed the date of return, when the user will return the book, automatically the fine will be calculated and will be shown to the admin.



###### USERS:

Here the admin will see all the users what have borrowed the books.

The list will have the following aspects:

* ID
* Name
* Email
* Role
* No. of Books borrowed
* Registered On (Date and timestamp)



###### ADD NEW ADMIN:

Only a admin is allowed to register another admin.



Aspects: 

* Name
* Email
* Password
* Profile Picture



