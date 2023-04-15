const express = require('express');
const fs = require('fs');
const PORT = 3002;
const app = express();
app.use(express.json());  

function readProducts(callback){
  fs.readFile("./products.txt", function (err, content) {
    if (err) return callback(err)
    callback(null, JSON.parse(content))
  })
};

// Method to read write from txt file
function writeProducts (data) {
  try {
    fs.writeFileSync('./products.txt', JSON.stringify(data));
    console.log('it saved')
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
app.get('/api/v1/products', async(req, res) => {
    readProducts(function (err, content) {
      if(err){
        res.status(404)
      }else{
        res.status(200)
        res.send(content)
      }
  })
});
app.get('/api/v1/products/:id', async(req, res) => {
  const id = parseInt(req.params.id);   // toma el parametro del id para compararlo 
  readProducts(function (err, products) {
    if (err) {
      res.status(404).send('Product not found');
    } else {
      const product = products.find((product) => product.id === id);   // buscando dentro de los productos el que tenga el mismo ID
      if (!product) {
        res.status(404).send('Product not found');     //si el id no existe
      } else {
        res.status(200).json(product);        //si el id existe, lo enviamos como respuesta 
      }
    }
  });
});

app.post('/api/v1/products', async(req, res) => {                     // solicitud post  agregar productos 
  const {name, description, price, quantity, category } = req.body;  
  if (name && description && price && quantity && category) {    // condicional si nos ingresas name,descriptios...
    readProducts(function (err, products) {
      if(err){
        res.status(404)
      } else {
        const id = products.length + 1;     // el id va  ser igual al ultimo que este por defecto + 1 siendo en ultimo el que se ingreso 
        const newProduct = ({ id,...req.body});  // el nuevo producto tiene que tener name descriprion
        products.push(newProduct);
        console.log(products)
        if (writeProducts(products)) {
          res.status(200).json(products); 
        }else{
          res.status(500).json('Product cant be saved, try again'); 
        }
        
      }
    })
  }else{
    res.send('Product cant be save, all data is required');
    res.status(400).end();
  }
});
app.patch('/api/v1/products/:id', (req, res) => {     //solicitud o actualizancion de algun producto 
  const { id } = req.params;
  const { name, description, price, quantity, category } = req.body;
  console.log()
  readProducts(function (err, products) {
    if(err){
      res.status(404)
    }else{
      products.forEach((product, i) => {
        if (product.id.toString() === id) {
          product.name = name;
          product.description = description;
          product.price = price;                // miramos las caracteristicas los products que ya tenemos y las 
          product.quantity = quantity;         // cambiamos si nos ingresan nuevas 
          product.category = category;
        }
      });
      if (writeProducts(products)) {
        res.status(200).json(products); 
      }else{
        res.status(500).json('Product cant be saved, try again'); 
      }
    }
  })
});

app.delete('/api/v1/products/:id', (req, res) => {   // solicitud delate para eliminar un producto con id 
  const id = parseInt(req.params.id);   // toma el parametro del id para comprararlo 
  readProducts(function (err, products) {
    if (err) {
      res.status(404);
    } else {
      const index = products.findIndex((product) => product.id === id);   //comparando buscando dentro de los productos
      if (index !== -1) {                                          // encontrar 
         const deletedProduct = products[index];
        products.splice(index, 1);
        writeProducts(products); 
        res.send(`producto ${deletedProduct.name}fue eliminado`);
      } 
      res.status(200);
      res.send(products);
    }
  });
}); 

app.listen(PORT, () => {                            //puerto  escuchando 
  console.log(`escuchando en el puerto  ${PORT}`);   
});