const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const {body , validationResult} = require ("express-validator");

const app = express ();

const port = 9183;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//connection
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Kis766626@", //mysql root password
    port: "3306", //mysql root port id
    database: "hotel_db" //mysql database name
});


db.connect((err) => {
    if(err){
        console.error("Error Connecting" , err.stack);
        return;
    }
    console.log("Connected as id", db.threadId); 
});


//route to get Customer details
app.get("/cust", (req, res)=>{
    const colCust = "SELECT CustID, FirstName, LastName, Email, Contact, ValidID From customers";

    db.query(colCust, (err, results) => {
        if (err) {
            return res.status(500).json({ error : "Database query failed."});
        }
        res.json(results);
    });
});

//route to get Customer details by ID
app.get("/cust/:ID", (req, res) => {
    const {ID} = req.params;
    const colCust = "SELECT CustID, FirstName, LastName, Email, Contact, ValidID From customers where CustID = ?";

    db.query(colCust, [ID], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({message: "Customer not found" });
        }
        res.status(200).json({ customer: result[0]});
       
    });
});


//route to add customer by POST method
app.post("/addcust",(req, res) => {
    const{
        FirstName,
        LastName,
        Email,
        Contact,
        ValidID
    } = req.body;

    const error =[];

    //validation query for post
if(!FirstName)
    error.push({field: "FirstName", message: "First name is required" });
if(!LastName)
    error.push({field: "LastName", message: "Last name is required" });
if(!Email)
    error.push({field:"Email", message: "Email is required"});
if(!Contact)
    error.push({field: "Contact", message: "Contact is required"});
if(!ValidID)
    error.push({field: "ValidID", message:"ID is required"});

if(error.length > 0){
    return res.status(400).json({error});
}

const query = `INSERT INTO customers(FirstName, LastName, Email, Contact, ValidID)
VALUES (?,?,?,?,?)`;

db.query(
    query,
    [
        FirstName,
        LastName,
        Email,
        Contact,
        ValidID
    ],
    (err, result)=>{
        if (err){
            return res.status(500).json({message: "Database error", error: err})
        };
        res.status(200).json({message: "Customer added successfully", 
            CustID: result.insertId
        });
    }
);
});





























// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

