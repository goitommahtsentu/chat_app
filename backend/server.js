import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import path from "path"
dotenv.config();
const app = express();
const __dirname=path.resolve()

app.use(express.json());
app.use("/api/auth", authRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))
}
app.get(/.*/,(req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
})



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});