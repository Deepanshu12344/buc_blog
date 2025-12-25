import Blog from "../models/Blogs.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newBlog = await Blog.create({
      title,
      content,
      author: req.user.id, 
    });

    await newBlog.populate('author', 'firstname lastname email');

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'firstname lastname email')
      .sort({ createdAt: -1 });

    res.status(200).json({ blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'firstname lastname email')
      .populate('comments.user', 'firstname lastname email');

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog is not there" });

    if (blog.author.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this blog",
      });
    }

    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({ message: "Blog deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({
        message: "At least one field (title or content) is required",
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog is not there" });

    if (blog.author.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to edit this blog",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        ...(title && { title }),
        ...(content && { content }),
      },
      { new: true }
    ).populate('author', 'firstname lastname email');

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};