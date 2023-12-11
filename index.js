import express from "express";
import mongoose from "mongoose";//conection to my database
const app = express();
mongoose.connect('mongodb://localhost/ProductCatalog');//conection to my database

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.static('public/images'));
app.use(express.json());


//app.get('/',(req, res) => {
//	res.json({"Name":"Hello World"});

//});


//GET Products/images/filename
app.get('/Products/images/:field', (req, res) => {
	res.render("filename",{fieldName:req.params.field});
	//res.render("filename");
	
});

//GET  - Path /Products
const productSchema = new mongoose.Schema(
{Name: String,
 Price: Number, 
 Colour: String, 
 Manufacturer: String, 
 StartingDateAvailable: String,
 EndingDateAvailable: String,
 Image: String, 
 Description: String, 
 Type: String, 
 PanWidth: Number, 
 HandleLength: Number});
 
const product = mongoose.model("Products", productSchema);

//Get - Products - Return a JSON object containing all the products in the database
app.get('/Products', async(req, res) => {
		try{
			const allProducts = await product.find({},'-_id');
		res.status(200).json(allProducts);
		}
		catch (error){
			res.status(500).json({message:error.message});
		}
});

//Get - Products/identifiers - Return a JSON object containing the IDs of all the products in the database
app.get('/Products/identifiers', async(req, res) => {
		try{
			const allProducts = await product.find({});
		res.status(200).json(allProducts);
		}
		catch (error){
			res.status(500).json({message:error.message});
		}
});


//Get - Products/id - Return a JSON object containing all the Product’s details in the MongoDB
app.get('/Products/:id', async(req, res) => {
		try{
			const allProducts = await product.findOne({_id: req.params.id});
		res.status(200).json(allProducts);
		}
		catch (error){
			res.status(500).json({message:error.message});
		}
});

//Get - Products/id/field - Return a JSON object the specified {field} info from the Product’s details in the MongoDB
app.get('/Products/:id/:field', async(req, res) => {
		try{
			const allProducts = await product.findOne({_id: req.params.id},req.params.field + ' -_id');
		res.status(200).json(allProducts);
		}
		catch (error){
			res.status(500).json({message:error.message});
		}
});

//part 6 

//update - replace.
app.put('/Products/:id', async(req, res) => {
		try{
			const productId = req.params.id;
			console.log("info: "+req.body);
			console.log("id: "+req.params.id);
			console.log("req: "+req.params);
			const updatedProduct = {
			Name: req.body.Name,
			Price: req.body.Price, 
			Colour: req.body.Colour, 
			Manufacturer: req.body.Manufacturer, 
			StartingDateAvailable: req.body.StartingDateAvailable,
			EndingDateAvailable: req.body.EndingDateAvailable,
			Image: req.body.Image, 
			Description: req.body.Description, 
			Type: req.body.Type, 
			PanWidth: req.body.PanWidth, 
			HandleLength: req.body.HandleLength
				
		};
		
		await product.findOneAndUpdate({_id:productId},updatedProduct,{new: true});
		res.status(200).json({'Message': 'success'});
		}
		catch (err){
		console.error(err);
		res.status(500).json({'Message': 'Fail'});
	}
});
//Delete
app.delete('/Products/:id', async(req,res)=>{
	try{
		const productDeleted = await product.findByIdAndDelete({_id: req.params.id});
		if(!productDeleted){
				res.status(404).json({'Message': 'Product not Found!'});
		}
		res.status(200).json({'Message': 'success'});
	} catch(err){
		console.error(err);
			res.status(500).json({'Message': 'Fail'});
	}
	
});


app.listen(8080);


