import express from "express";

const app = express();


app.get('/adapter', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'tyhis should return something',
  })
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});