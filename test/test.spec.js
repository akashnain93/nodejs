import chai, { expect } from "chai";
import randomstring from "randomstring";
import mocha from "mocha";
import chaiHttp from "chai-http";
import con from "../database.js";
import { app } from "../app.js";
import BlueBird from "bluebird";

const should = chai.should();
chai.use(chaiHttp);

const port = process.env.PORT || 9090;
const server = app.listen(port);

const setup = (...eventObjects) => {
  return BlueBird.mapSeries(eventObjects, (event) => {
    return chai
      .request(server)
      .post("/products")
      .send(event)
      .then((response) => {
        return response.body;
      });
  });
};

describe("Main-Tests", function () {
  let product1 = {
    id: 1,
    name: "Ball Gown",
    category: "Full Body Outfits",
    retail_price: 337.0,
    discounted_price: 272.97,
    availability: true,
  };

  const product2 = {
    id: 2,
    name: "Shawl",
    category: "Accessories",
    retail_price: 283,
    discounted_price: 260.36,
    availability: true,
  };

  let product3 = {
    id: 3,
    name: "Overalls",
    category: "Full Body Outfits",
    retail_price: 374.0,
    discounted_price: 321.64,
    availability: true,
  };

  this.afterAll(async function () {
    server.close();
  });
  this.beforeAll(async function () {
    let sql = "DELETE FROM product";
    con.run(sql, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  });

  this.afterEach(async function () {
    let sql = "DELETE FROM product";
    con.run(sql, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  });

  it("Status Should be 400 if id already exists in post request", async () => {
    try {
      const result = await setup(product1);

      const res = await chai.request(server).post("/products").send({
        id: 1,
        name: "Ball Gown",
        category: "Full Body Outfits",
        retail_price: 337.0,
        discounted_price: 272.97,
        availability: true,
      });

      res.should.have.status(400);
    } catch (error) {
      throw new Error(error);
    }
  });

  it("Status should be 404 if the id is not present on doing get by id", async () => {
    try {
      const result = await setup(product1)

      const res1 = await chai.request(server).get("/products/1");

      const res2 = await chai.request(server).get("/products/2");

      res1.should.have.status(200);

      res2.should.have.status(404);
    } catch (error) {
      throw new Error(error);
    }
  });

  it("Update Product by id", async () => {
    try {
      const result = await setup(product1);

      const res = await chai.request(server).put("/products/1").send({
        retail_price: 283,
        discounted_price: 260.36,
        availability: true,
      });

      res.status.should.eq(200);
    } catch (error) {
      throw new Error(error);
    }
  });

  it("Status should be 400 on Updating Product by id if the id does not exist", async () => {
    try {
      const res = await chai.request(server).put("/products/1").send({
        retail_price: 283,
        discounted_price: 260.36,
        availability: true,
      });

      res.status.should.eq(400);
    } catch (error) {
      throw new Error(error);
    }
  });

  it("Getting product by query through only category", async () => {
    try {
      const result = await setup(product1,product2,product3);

      const res = await chai.request(server).get("/products?category=Full%20Body%20Outfits");

      res.should.have.status(200)

      res.body.length.should.eq(2)

      res.body[0].id = Number(res.body[0].id)

      res.body[1].id = Number(res.body[1].id)

      res.body[0].id.should.eq(1)

      res.body[1].id.should.eq(3)
    } catch (error) {
      throw new Error(error);
    }
  });

  it("Getting product by query through only category checking the availability sorting", async () => {
    try {
      product1.availability = false

      const result = await setup(product1,product2,product3);

      const res = await chai.request(server).get("/products?category=Full%20Body%20Outfits");

      res.should.have.status(200)

      res.body.length.should.eq(2)

      res.body[0].id = Number(res.body[0].id)

      res.body[1].id = Number(res.body[1].id)

      res.body[0].id.should.eq(3)

      res.body[1].id.should.eq(1)
    } catch (error) {
      throw new Error(error);
    }
  });

  it("Getting product by query through only category checking the discounted sorting", async () => {
    try {
      product1.availability = true

      product3.discounted_price = 4

      const result = await setup(product1,product2,product3);

      const res = await chai.request(server).get("/products?category=Full%20Body%20Outfits");

      res.should.have.status(200)

      res.body.length.should.eq(2)

      res.body[0].id = Number(res.body[0].id)

      res.body[1].id = Number(res.body[1].id)

      res.body[0].id.should.eq(3)

      res.body[1].id.should.eq(1)
    } catch (error) {
      throw new Error(error);
    }
  });

  it("Getting product by query through category and availability", async () => {
    try {
      product1.availability = false

      const result = await setup(product1,product2,product3);

      const res = await chai.request(server).get("/products?category=Full%20Body%20Outfits&availability=1");

      res.should.have.status(200)

      res.body.length.should.eq(1)

      res.body[0].id = Number(res.body[0].id)

      res.body[0].id.should.eq(3)

    } catch (error) {
      throw new Error(error);
    }
  });

  
  it("Getting product by query through category and availability checking the dicount-percentage sorting", async () => {
    try {
      product1.availability = true

      product3.discounted_price = 2.8

      product3.retail_price = 4

      const result = await setup(product1,product2,product3);

      const res = await chai.request(server).get("/products?category=Full%20Body%20Outfits&availability=1");

      res.should.have.status(200)

      res.body.length.should.eq(2)

      res.body[0].id = Number(res.body[0].id)

      res.body[1].id = Number(res.body[1].id)

      res.body[0].id.should.eq(3)

      res.body[1].id.should.eq(1)

    } catch (error) {
      throw new Error(error);
    }
  });

});
