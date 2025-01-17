import ErrorHandler from "./Middleware/ErrorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import databaseConnection from "./config/dbconnect.js";
import dotenv from "dotenv";
import express from "express";
import noteRoutes from "./routes/note.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);
app.use("/categories", categoryRoutes);

app.use(ErrorHandler);

app.listen(PORT, async () => {
    await databaseConnection();
    console.log(`Server is running on port ${PORT}`)
})








