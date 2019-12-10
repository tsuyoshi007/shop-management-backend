const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;

const pg = require("pg");
var url = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

const getTable = (req, res) => {
  const client = new pg.Client(url);
  client.connect(function(err) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        data: err
      });
    }
  });
  client.query("select * from product;", function(err, result) {
    if (err) {
      return res.status(500).json({
        success: false,
        data: err
      });
    }
    res.status(200).json(result.rows);
    client.end();
  });
};

const insertRow = (req, res) => {
  const product = {
    product_name: req.body.product_name,
    description: req.body.description,
    quantity: req.body.quantity,
    price: req.body.price,
    category_id: req.body.category_id
  };
  const client = new pg.Client(url);

  client.connect(function(err) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        data: err
      });
    }
  });
  client.query(
    "insert into product (product_name,description,quantity,price,category_id) values ($1,$2,$3,$4,$5) returning *;",
    [
      product.product_name,
      product.description,
      product.quantity,
      product.price,
      product.category_id
    ],
    function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err
        });
      }
      res.status(200).json([result.rows[result.rows.length - 1]]);
      client.end();
    }
  );
};

const editRow = (req, res) => {
  const product = {
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    description: req.body.description,
    quantity: req.body.quantity,
    price: req.body.price,
    category_id: req.body.category_id
  };
  const client = new pg.Client(url);

  client.connect(function(err) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        data: err
      });
    }
  });
  client.query(
    "update product set product_name=$2,description=$3,quantity=$4,price=$5,category_id=$6 where product_id=$1 returning *;",
    [
      product.product_id,
      product.product_name,
      product.description,
      product.quantity,
      product.price,
      product.category_id
    ],
    function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err
        });
      }
      res.status(200).json([result.rows[result.rows.length - 1]]);
    }
  );
};

const deleteRow = (req, res) => {
  const product_id = req.body.product_id;

  const client = new pg.Client(url);

  client.connect(function(err) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        data: err
      });
    }
  });
  client.query(
    "delete from product where product_id = $1;",
    [product_id],
    function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err
        });
      }
      res.status(200).json({ success: true });
    }
  );
};

module.exports = {
  getTable: getTable,
  insertRow: insertRow,
  editRow: editRow,
  deleteRow: deleteRow
};
