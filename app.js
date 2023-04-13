const express = require('express');
const fs = require('fs');
const PORT = 4000;
const app = express();
app.use(express.json());    
 
const readProducts = () => {                         //devuelve los datos como un objeto JSON
  const products = fs.readFileSync('./products.txt'); // Se define una constante llamada products que contiene los datos 
  return JSON.parse(products);               //leídos desde el archivo products.txt utilizando el método readFileSync del módulo fs de Node.js
}; 


const writeProducts = (products) => {
  fs.writeFileSync('./products.txt', JSON.stringify(products)); // productos 
};

app.get('/api/v1/products', (req, res) => { // solicitud get 
  const products = readProducts();       //devolver producto en json 
  res.send(products);                    // mostrar lista de productos 
});

app.post('/api/v1/products', (req, res) => {                     // solicitud post  agregar productos 
  const {id,name,description,price,quantity,category } = req.body;  
  const products = readProducts();                                //devolver los productos a json 
  if (name && description && price && quantity && category) {    // condicional si nos ingresas name,descriptios...
   const id = products.length + 1;     // el id va  ser igual al ultimo que este por defecto + 1 siendo en ultimo el que se ingreso 
    const newProduct = { ...req.body };  // el nuevo producto tiene que tener name descriprion
    products.push(newProduct);           //agreganos newproducts a la lista de products 
    writeProducts(products);
    res.status(201).end();
    res.send(products);                 // mostramos la lista de productos, ya con nuestro nuevo producto agregado 
  } else {
     //  res.send('No se puede guardar el producto');
      // res.status(409).end();
  }
});

app.delete('/api/v1/products/:id', (req, res) => {   // solicitud delate para eliminar un producto con id 
  const id = parseInt(req.params.id);   // toma el parametro del id y vuelve en un valor un entero 
  const products = readProducts();
  const index = products.findIndex((products) => products.id === id);   //comparando buscando dentro de los productos
  if (index !== -1) {                                          // encontrar 
    products.splice(index, 1);
    writeProducts(products); 
    res.send('producto eliminado');
  } else {
    res.send('Producto no encontrado');
  }
});

app.patch('/api/v1/products/:id', (req, res) => {     //solicitud o actualizancion de algun producto 
  const { id } = req.params;
  const { name, description, price, quantity, category } = req.body;
  const products = readProducts();
 {
    products.forEach((product, i) => {
      if (products.id === id) {
        products.name = name;
        products.description = description;
        products.price = price;                // miramos las caracteristicas los products que ya tenemos y las 
        products.quantity = quantity;         // cambiamos si nos ingresan nuevas 
        products.category = category;
      }else {
        res.send('Error al actualizar producto');
      }
    });
    writeProducts(products);
    res.json(products);                   //mostramos nuestra lista de prductos actializada 
  }
});

app.listen(PORT, () => {                            //puerto  escuchando 
  console.log(`escuchando en el puerto  ${PORT}`);   
});
