import { Router } from "express";
import {
  addProduct,
  getProductById,
  getProductByQuery,
  updateProductById
} from "../controllers/product.js";

const ProductsRouter = Router();

ProductsRouter.post("/products",addProduct);
ProductsRouter.get("/products/:id",getProductById);
ProductsRouter.get("/products",getProductByQuery)
ProductsRouter.put("/products/:id",updateProductById);

export { ProductsRouter };
