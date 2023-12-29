import  express  from  "express";
import _Dirname from "../../../utils.js";
import { TypeUserCheck } from "../../../utils.js";

import modelCourts from "../../models/modelCourts.js"
import modelCarts from "../../models/modelCarts.js";

const cartsDB = express.Router();
cartsDB.use(express.json());
cartsDB.use(express.static(_Dirname + "/src/public"));


// devuelve todos los carritos
cartsDB.get( "/Get_dbcarrito/:id?", async (req,res) => {

    const result = await modelCarts.find().populate("products.product").lean();

    let newArray = result.map( (p) => {return p});

    let id = req.params.id;
    
    let newFilter = newArray.filter( (cart) => {
        
        console.log(cart._id.toString() === id)
        return cart._id.toString() === id; 
    
    });

    console.log(newFilter)

    if(id !== undefined){
        res.status(200).json(newFilter)
    }
    else{
        res.status(200).json(newArray)
    }
    

});


// agregar un producto en carrito
cartsDB.put( "/Put_dbcarrito/:cid/product/:pid", TypeUserCheck("user"), async (req,res) => {

    let user = req.user;

    const {  params : {pid, cid}, body } = req;

    try {

      const cart = await modelCarts.findById(cid).populate("products.product");
      const product = await modelCourts.findById(pid);
      
      console.log({
        "product": product,
        "cart": cart
      });

      if (!cart) {

        return res.status(404).json({ message: "CART NOT FOUND" });

      }else if(user.id === product.owner){

        return res.status(400).send("el producto es de la propiedad del usuario por lo tanto no puede agregarlo a su carrito")

      }


      const productIndex = cart.products.findIndex( (p) => p.product._id.toString() === pid);


      if (productIndex >= 0) {

        cart.products[productIndex].quantity =  cart.products[productIndex].quantity + body.quantity;

      } else {

        cart.products.push({ product: pid, quantity: body.quantity });

      }

      await cart.save();
      return res.status(200).json(cart);

    }
    catch (error) {

      console.log(error);
      return res.status(500).json({ message: "SERVER ERROR" });

    }

});
// elimino un producto en carrito
cartsDB.put( "/Put_dbcarrito/:cid/eliminateProduct/:pid", async (req,res) => {

    const { params : {pid, cid} } = req;
    
    try {

      const cart = await modelCarts.findById(cid).populate("products.product");

      if (!cart) {

        return res.status(404).json({ message: "CART NOT FOUND" });

      }

      const productIndex = cart.products.findIndex( (p) => p.product._id.toString() === pid);

      if (productIndex >= 0) {

      cart.products.splice(productIndex, 1);
       
        await cart.save();
        return res.status(200).json(cart);

      }else {

        return res.status(404).json({ message: "PRODUCT NOT FOUND" });

      }

    }catch (error) {

      console.log(error);
      return res.status(500).json({ message: "SERVER ERROR" });

    }

});
// finalizo la compra del carrito
cartsDB.put("/Put_dbcarrito/purchase", TypeUserCheck("user"), async (req,res) => {

    let cartId = req.user.cart;

    let result = await modelCarts.findById(cartId).populate('products.product');

    let data = await result.then((data) => {

        //console.log(data)
        
        let stock_quantity = data.products.map( (producto) => {
            return ({
                id_producto: producto.product._id,
                quantity: producto.quantity,
                stock: producto.product.stock
            })
        });

        return (stock_quantity);
    
    });

    //console.log(data);

    let enoughStock = data.filter( (element) => {
        if(element.quantity > element.stock){
            return element;
        }
    });


    if(enoughStock.length === 0 && data.length !== 0){

        data.forEach(async (element) => {

            let producto = await modelCourts.findById(element.id_producto.toString());

            console.log("opt1: " + producto);

            let newQuantity = producto.stock - element.quantity;

            await modelCourts.updateOne( {_id: element.id_producto.toString()}, {$set: {stock: newQuantity}});

        })

        await modelCarts.updateOne( {_id: req.user.cart}, {$set:{products: []}})

        res.status(200).send("todos los productos tienen stock y pueden proceder a ser comprados");

    }else if(enoughStock.length !== 0 && data.length !== 0){

        data.forEach(async (element) => {

            let producto = await modelCourts.findById(element.id_producto.toString());

            //console.log("opt2: " + producto)

            if(element.quantity > producto.stock){

                //console.log(element);

            }else{

                let newQuantity = producto.stock - element.quantity 

                await modelCourts.updateOne( {_id: element.id_producto.toString()}, {$set: {stock: newQuantity}});
            }

        })

        let filterCart = data.filter((element) => {

            if(element.quantity > element.stock){
                return element
            }

        })
            
        console.log(filterCart);

        await modelCarts.updateOne( {_id: req.user.cart}, {$set:{products: filterCart}});

        res.status(404).send("uno de los productos no tiene suficiente stock, esta compra no puede ser efectuada");

    }else{
        res.status(404).send("no hay productos en el carrito")
    }

})
// elimino un carrito entero
cartsDB.delete( "/Delete_dbcarrito/:cid", async (req,res) => {

    const { cid } = req.params;
    
    try {

        const result = await modelCarts.findByIdAndDelete(cid);

        if (!result) {

            return res.status(404).json({ message: "CART NOT FOUND" });

        }
        return res.status(200).json({ message: "CART DELETED" });

    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "SERVER ERROR" });
        
    }

});



export default cartsDB;