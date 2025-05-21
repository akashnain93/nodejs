import con from "../database.js";

const addProduct = async (req, res) => {
  try {
    let sql = `SELECT * FROM product where id = ${req.body.id}`;

    if (req.body.availability) {
      req.body.availability = 1;
    } else {
      req.body.availability = 0;
    }

    con.all(sql, (error, result) => {
      if (result.length == 0) {
        sql = `INSERT INTO product (id,name,category,retail_price,discounted_price,availability) VALUES (${req.body.id},"${req.body.name}","${req.body.category}","${req.body.retail_price}","${req.body.discounted_price}",${req.body.availability})`;

        con.run(sql, (error, result) => {
          if (!error) {
            res.status(201).send("Product added");
          }
        });
      } else {
        res.status(400).send("Product Already Exists");
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getProductById = async (req, res) => {
  try {
    let sql = `SELECT * FROM product WHERE id = ${req.params.id}`;

    con.all(sql, (error, result) => {
      if (result.length == 0) {
        res.status(404).send("No Such Product Found");
      } else {
        result.map((value) => {
          if (value.availability == 1) {
            value.availability = true;
          } else {
            value.availability = false;
          }
        });
        res.status(200).send(result[0]);
      }
    });
  } catch (error) {
    res.status(404).send("Some Error Occured");
  }
};

const getProductByCategory = async (req, res) => {
  try {
    let sql = `SELECT * FROM product WHERE category = "${req.query.category}" ORDER BY availability DESC,discounted_price,id`;

    con.all(sql, (error, result) => {
      if (result.length == 0) {
        res.status(404).send("No Such Product Found");
      } else {
        result.map((value) => {
          if (value.availability == 1) {
            value.availability = true;
          } else {
            value.availability = false;
          }
        });
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(404).send("Some Error Occured");
  }
};

const getProductByCategoryAndAvailability = async (req, res) => {
  try {
    let sql = `SELECT * FROM product WHERE category = "${req.query.category}" AND availability = ${req.query.availability} ORDER BY (discounted_price/retail_price),discounted_price,id`;

    con.all(sql, (error, result) => {
      if (result.length == 0) {
        res.status(404).send("No Such Product Found");
      } else {
        result.map((value) => {
          if (value.availability == 1) {
            value.availability = true;
          } else {
            value.availability = false;
          }
        });
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(404).send("Some Error Occured");
  }
};

const getProductByQuery = async (req, res) => {
  try {
    if (req.query.category && req.query.availability) {
      getProductByCategoryAndAvailability(req, res);
    } else if (req.query.category) {
      getProductByCategory(req, res);
    } else {
      getAllProduct(req, res);
    }
  } catch (error) {
    res.status(404).send("Some Error Occured");
  }
};

const getAllProduct = async (req, res) => {
  try {
    const sql = "SELECT * FROM product";

    con.all(sql, (error, result) => {
      if (result.length == 0) {
        res.status(404).send("No Such Product Found");
      } else {
        result.map((value) => {
          if (value.availability == 1) {
            value.availability = true;
          } else {
            value.availability = false;
          }
        });
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(404).send("Some Error Occured");
  }
};

const updateProductById = async (req, res) => {
  try {
    let sql = `SELECT * FROM product WHERE id = ${req.params.id}`;

    if (req.body.availability) {
      req.body.availability = 1;
    } else {
      req.body.availability = 0;
    }

    con.all(sql, (err, result) => {
      if (result.length == 0) {
        res.status(400).send("No Such Product");
      } else {
        sql = `UPDATE product SET retail_price = ${req.body.retail_price},discounted_price = ${req.body.discounted_price},availability = ${req.body.availability} WHERE id = ${req.params.id}`;

        con.run(sql, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).send("Product Updated");
          }
        });
      }
    });
  } catch (error) {
    res.status(404).send("Some Error Occured");
  }
};

export { addProduct, getProductById, getProductByQuery, updateProductById };
