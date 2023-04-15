const express = require('express');
const fs = require('fs');
const PORT = 3002;
const app = express();
app.use(express.json());    
async function readProducts(products){
  products = ('./products.txt')
    const data =await fs.promises.readFile('./products.txt','utf-8');
  };
async function writeProducts (product, data) {
    await fs.promises.writeFile('./products', data);
};
app.get ('./',(req,res)=>{
  const products = readProducts(); 
  res.send('ruta padre')
});

//app.get("/api/v1/products/:product",(req,res)=>{
//  const {productsId} = req.params;
//  const productsIdINT = parseInt(prudusctsId);
// const products = personas.find((products)=> personas.id === personasIdINT);
//  console.log(req.params);
//});
products = ('./products.txt')

app.get('/api/v1/products',async(req, res) => {
  const products =await readProducts();
  res.json(products);
});

app.post('/api/v1/products', (req, res) => {                     // solicitud post  agregar productos 
  const {name,description,price,quantity,category } = req.body;  
  const products = readProducts();                                //devolver los productos a json 
  if (name && description && price && quantity && category) {    // condicional si nos ingresas name,descriptios...
   const id = products.length + 1;     // el id va  ser igual al ultimo que este por defecto + 1 siendo en ultimo el que se ingreso 
    const newProduct = ({ id,...req.body});  // el nuevo producto tiene que tener name descriprion
    products.push(newProduct);
    writeProducts(products);
    res.status(200).json(products);            
  } else {
      res.send('No se puede guardar el producto');
       res.status(400).end(); //solicitud incorrecta
  }
});



app.patch('/api/v1/products/:id', (req, res) => {     //solicitud o actualizancion de algun producto 
  const { id } = req.params;
  const { name, description, price, quantity, category } = req.body;
  const products = readProducts();
 {
    products.forEach((Product, i) => {
      if (products.id === id) {
        products.name = name;
        products.description = description;
        products.price = price;                // miramos las caracteristicas los products que ya tenemos y las 
        products.quantity = quantity;         // cambiamos si nos ingresan nuevas 
        products.category = category;
      }else {
        res.send('Error al actualizar producto');
        res.status(404).end();
      }
    });
    writeProducts(products);
    res.json(products);                   //mostramos nuestra lista de prductos actializada 
  }
});



app.delete('/api/v1/products/:id', (req, res) => {   // solicitud delate para eliminar un producto con id 
  const id = parseInt(req.params.id);   // toma el parametro del id para comprararlo  
  const products = readProducts();
  const index = products.findIndex((products) => products.id === id);   //comparando buscando dentro de los productos
  if (index !== -1) {                                          // encontrar 
    products.splice(index, 1);
    writeProducts(products); 
    res.send('producto eliminado');
  } else {
    res.send('producto no encontrado')
    res.status(404).end();
  }
}); 

app.listen(PORT, () => {                            //puerto  escuchando 
  console.log(`escuchando en el puerto  ${PORT}`);   
});


