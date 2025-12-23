import express from 'express';
import { createBlog, deleteBlog, editBlog } from '../controllers/blog.js'; 
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();

router.post("/new-story", verifyToken, createBlog);
router.put("/new-story/:id", verifyToken, editBlog);
router.delete("new-story/:id", verifyToken, deleteBlog);

export default router;