const express = require("express");

const cors = require("cors");

const app = express();


// Middleware
app.use(cors());

app.use(express.json());


// Join Request Routes
const joinRequestRoutes = require("./routes/joinRequestRoutes");

app.use("/api/requests", joinRequestRoutes);


// Server
const PORT = 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});