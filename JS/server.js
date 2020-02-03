
  const express = require("express");
  const lowdb = require("lowdb");
  const app = express();
  const FileSync = require("lowdb/adapters/FileSync");
  const adapter = new FileSync("Grady_shop.json");
  const database = lowdb(adapter);
  const port = process.env.PORT || 3000;
  
  //Database Initiator
  
  const initiateProducts = () => {
    const databaseInitiated1 = database.has("products").value();
  
    if (!databaseInitiated1) {
      database.defaults({ products: [] }).write();
    }
  
    const databaseInitiated2 = database.has("shoppingcart").value();
  
    if (!databaseInitiated2) {
      database.defaults({ shoppingcart: [] }).write();
    }
  };
  
  // Product insertion point.
  
  const insertProduct = async (name, price, picture) => {
    const response = await database
      .get("products")
      .push({ name: name, price: price, picture: picture })
      .write();
    return response;
  };
  
  // Get products.
  
  const getProducts = async () => {
    return await database.get("products").value();
  };
  
  // Product insertion operator. aka post code.
  
  app.post("/api/product", async (request, response) => {
    console.log(request.url);
    const name = request.query.name;
    const price = request.query.price;
    const picture = request.query.picture;
  
    let message = {
      success: true,
      message: "Product added"
    };
  
    const res = await insertProduct(name, price, picture);
    message.data = res[0];
    response.send(message);
  });
  
  // Operate get all products
  
  app.get("/api/product", async (response) => {
    const data = await getProducts();
    response.send(data);
  });
  
  // ShoppingCart insertion point.
  
  const insertCart = async (name, price, picture) => {
    const response = await database
      .get("shoppingcart")
      .push({ name: name, price: price, picture: picture })
      .write();
    return response;
  };
  
  // ShoppingCart insertion operator.
  
  app.post("/api/shoppingcart/", async (request, response) => {
    console.log(request.url);
    const name = request.query.name;
    const price = request.query.price;
    const picture = request.query.picture;
  
    //  Checking item's availability in cart.
  
    const boughtItem = await database
      .get("shoppingcart")
      .find({ name: name, price: price, picture: picture })
      .value();

    // Checking Product List for item.
  
    const availableProduct = await database
      .get("products")
      .find({ name: name, price: price, picture: picture })
      .value();
  
    let message = {
      success: true,
      message: "Shoppingcart updated"
    };
  
    // Operate
  
    if (boughtItem) {
      const errorMessage1 = {
        error: "ERROR",
        message: "No repeat items. Try another!"
      };
      response.send(errorMessage1);
    } else if (!availableProduct) {
      const errorMessage2 = {
        error: "ERROR",
        message: "Unavailable product!"
      };
      response.send(errorMessage2);
    } else {
      const res = await insertCart(name, price, picture);
      message.data = res[0];
      response.send(message);
    }
  });
  
  // Get items in shoppingcart
  
  const getCart = async () => {
    return await database.get("shoppingcart").value();
  };
  
  app.get("/api/shoppingcart", async (request, response) => {
    const data = await getCart();
    response.send(data);
  });
  
  // Delete item from Shopping Cart.
  
  const deleteCart = async (name, price, picture) => {
    const response = await database
      .get("shoppingcart")
      .remove({ name: name, price: price, picture: picture })
      .write();
    return response;
  };
  app.delete("/api/shoppingcart", async (request, response) => {
    console.log(request.url);
    const name = request.query.name;
    const price = request.query.price;
    const picture = request.query.picture;
  
    //  Checking for item in ShoppingCart.
  
    const boughtItem = await database
      .get("shoppingcart")
      .find({ name: name, price: price, picture: picture })
      .value();
  
    let message = {
      success: true,
      message: "Item removed!"
    };
  
    if (boughtItem) {
      const res = await deleteCart(name, price, picture);
      message.data = res[0];
      response.send(message);
    } else {
      const errorMessage = {
        error: "ERROR",
        message: "Unavailable item!"
      };
      response.send(errorMessage);
    }
  });
  
  app.listen(port, () => {
    console.log("Server started on port:", port);
    initiateProducts();
  });
  