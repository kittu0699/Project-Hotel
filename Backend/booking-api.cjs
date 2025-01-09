const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { body, validationResult } = require("express-validator");

const app = express();

const port = 9183;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Kis766626@", //mysql root password
  port: "3306", //mysql root port id
  database: "hotel_db", //mysql database name
});

db.connect((err) => {
  if (err) {
    console.error("Error Connection", err.stack);
    return;
  }
  console.log("Connected as id", db.threadId);
});

//route to get Booking
app.get("/booking", (req, res) => {
  const ColBook =
    "Select BookingID, FullName, Email, Contact, CheckInDate, CheckOutDate, NoOfGuest, RoomType, IdentityProof From booking";

  db.query(ColBook, (err, results) => {
    if (err) {
      return res.Status(500).json({ error: "Database query failed." });
    }
    res.json(results);
  });
}); 

//route to get booking details by ID 
app.get("/booking/:ID", (req,res) => {
    const {ID} = req.params;
    const ColBook =  "Select BookingID, FullName, Email, Contact, CheckInDate, CheckOutDate, NoOfGuest, RoomType, IdentityProof From booking where BookingID = ? ";

    db.query(ColBook, [ID], (err, result) =>{
        if (err) {
            return res.status(500).json({ message: "Database error", error:err});
        }

        if (result.length === 0 ){
            return res.status(404).json({message: "Booking not found"})
        }
        res.status(200).json({ booking: result[0]});
    });
});


//route to add booking  by POST method
app.post("/addbooking", (req,res) => {
    const{
        FullName,
        Email,
        Contact,
        CheckInDate,
        CheckOutDate,
        NoOfGuest,
        IdentityProof
    } = req.body;
    const error = [];

    //validation query for post
    if(!FullName)
        error.push({field: "FullName", message: "Full name is required"});
    if(!Email)
        error.push({field: "Email", message: "Email is required"});
    if(!Contact)
        error.push({field: "Contact", message: "Contact is required" });
    if(!CheckInDate)
        error.push({field: "CheckInDate", message: "Check-IN-Date is required"});
    if(!CheckOutDate)
        error.push({field: "CheckOutDate", message: "Check-Out-Date is required"});
    if(!NoOfGuest)
        error.push({field: "NoOfGuest", message: "Enter number of guest"})
    if(!IdentityProof)
        error.push({field: "IdentityProof", message: "Enter Valid ID Number"});

    if(error.length > 0){
        return res.status(400).json({error});
    }

    const query = `INSERT INTO booking(FullName, Email, Contact, CheckInDate, CheckOutDate, NoOfGuest, IdentityProof)
    VALUES(?,?,?,?,?,?,?)`;

    db.query(
        query,
        [
            FullName,
            Email,
            Contact,
            CheckInDate,
            CheckOutDate,
            NoOfGuest,
            IdentityProof
        ],

        (err, result)=>{
           if(err){return res.status(500).json({message: "Database error", error: err})
        };
        res.status(200).json({message: "Booking Successfully",
            BookingId: result.insertID
        })
    } 
    );
})

//Route to Delete Booking
app.post("/bookingdelete/:ID", (req, res) =>{
    const {ID} = req.params;

    const DelBook =  "delete From booking where BookingID = ? ";

    db.query(DelBook, [ID], (err, result) =>{
        if (err) {
            return res.status(500).json({ message: "Database error", error:err});
        }

        if (result.length === 0 ){
            return res.status(404).json({message: "Booking not deleted"})
        }
        res.status(200).json({message: "Deleted Successfully"});
    });
})

app.post("/bookingupdate/:ID", (req, res) => {
    const { ID } = req.params; // Get the BookingID from the URL
    const { 
        FullName,
        Email,
        Contact,
        CheckInDate,
        CheckOutDate,
        NoOfGuest,
        IdentityProof
    } = req.body; // Extract fields to update from the request body

    // Ensure at least one field to update is provided
    if (!FullName && !Email && !Contact && !CheckInDate && !CheckOutDate && !NoOfGuest && !IdentityProof) {
        return res.status(400).json({ message: "No fields provided to update." });
    }

    // Build dynamic query to include only provided fields
    let fieldsToUpdate = [];
    let values = [];

    if (FullName) {
        fieldsToUpdate.push("FullName = ?");
        values.push(FullName);
    }
    if (Email) {
        fieldsToUpdate.push("Email = ?");
        values.push(Email);
    }
    if (Contact) {
        fieldsToUpdate.push("Contact = ?");
        values.push(Contact);
    }
    if (CheckInDate) {
        fieldsToUpdate.push("CheckInDate = ?");
        values.push(CheckInDate);
    }
    if (CheckOutDate) {
        fieldsToUpdate.push("CheckOutDate = ?");
        values.push(CheckOutDate);
    }
    if (NoOfGuest) {
        fieldsToUpdate.push("NoOfGuest = ?");
        values.push(NoOfGuest);
    }
    if (IdentityProof) {
        fieldsToUpdate.push("IdentityProof = ?");
        values.push(IdentityProof);
    }

    // Join fields to create the SET clause of the SQL query
    const setClause = fieldsToUpdate.join(", ");

    const UpdateBooking = `UPDATE booking SET ${setClause} WHERE BookingID = ?`;
    values.push(ID); // Add the ID as the last parameter

    // Execute the query
    db.query(UpdateBooking, values, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        // If no rows were updated, it means the ID was not found
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Booking not updated. ID not found." });
        }

        res.status(200).json({ message: "Updated Successfully" });
    });
});













// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
