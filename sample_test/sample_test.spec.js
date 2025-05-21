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

describe("Sample-Tests", function () {
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

  it("Checking the Post Request", async () => {
    try {
      const res = await chai.request(server).post("/products").send(product1);

      res.should.have.status(201);
    } catch (error) {
      throw new Error(error);
    }
  });

  it("Getting Product by id", async () => {
    try {
      const result = await setup(product1, product2);

      const res = await chai.request(server).get("/products/2");

      res.body.id = Number(res.body.id);

      res.status.should.eq(200);

      res.body.id.should.eq(2);
      res.body.name.should.eq("Shawl");
      res.body.category.should.eq("Accessories");
      res.body.retail_price.should.eq(283);
      res.body.discounted_price.should.eq(260.36);
      res.body.availability.should.eq(true);
    } catch (error) {
      throw new Error(error);
    }
  });

  it("Get all product from get request to products", async () => {
    try {
      const result = await setup(product1,product2);

      const res = await chai.request(server).get("/products");

      res.body[0].id = Number(res.body[0].id);

      res.body[1].id = Number(res.body[1].id);

      res.status.should.eq(200);

      res.body.length.should.eq(2)

      res.body[0].id.should.eq(1)

      res.body[1].id.should.eq(2)
    } catch (error) {
      throw new Error(error);
    }
  });
});
