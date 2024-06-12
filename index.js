import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Note from './Models/Notes.js';

const { Schema } = mongoose;

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
}

connectDB();

const PORT = process.env.PORT || 5000;
const noteSchema = new Schema({
    title: String,
    content: String,
    category: String
});


app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        data: null
    });
});

app.post("/notes", async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        return res.status(400).json({
            success: false,
            message: "Title, content, and category are required",
            data: null
        });
    }

    try {
        const newNote = await Note.create({
            title,
            content,
            category
        });

        res.json({
            success: true,
            message: "Note added successfully",
            data: newNote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding note",
            error: error.message
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
