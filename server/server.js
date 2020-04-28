const express = require('express');

const PORT = process.env.PORT || 4000;
const app = express();


app.get('/', (req, res, next) => {
    res.send("It worked...!");
})

app.listen(PORT, () =>{
    console.log("App is working on port: " + PORT);
})
