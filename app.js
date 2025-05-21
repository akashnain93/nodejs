import express from "express";
import dotenv from "dotenv";
import { ProductsRouter } from "./routes/product.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Content-Type, auth-token');
  // response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.get('/',(req,res) => {
  res.send("Welcome Page")
})

app.use(ProductsRouter);

export { app };
