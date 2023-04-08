const express = require('express');
const fs = require('fs');
const PORT = 7000;
const app = express();


const readProducts = () => {
  const products = fs.readFileSync('products.txt');
  return JSON.parse(products);
};


const writeProducts = (products) => {
  fs.writeFileSync('products.txt', JSON.stringify(products));
};

app.use(express.json());

app.get('/api/v1/products', (req, res) => {
  const products = readProducts();
  res.send(products);  

});

app.post('/api/v1/products', (req, res) => {
  const { name, description, price, quantity, category } = req.body;
  const products = readProducts();
  if (name && description && price && quantity && category) {
    const id = products.length + 1;
    const newProduct = { ...req.body, id };
    products.push(newProduct);
    writeProducts(products);
    res.send(products);
  } else {
    res.send('No se puede guardar el producto');
  }
});

app.delete('/api/v1/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    writeProducts(products);
    res.send('producto eliminado');
  } else {
    res.send('Producto no encontrado');
  }
});

app.patch('/api/v1/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category } = req.body;
  const products = readProducts();
  if (name && description && price && quantity && category) {
    products.forEach((product, i) => {
      if (product.id === id) {
        product.name = name;
        product.description = description;
        product.price = price;
        product.quantity = quantity;
        product.category = category;
      }
    });
    writeProducts(products);
    res.send(products);
  } else {
    res.send('Error al actualizar producto');
  }
});

app.listen(PORT, () => {
  console.log(`escuchando en el puerto  ${PORT}`);
});
