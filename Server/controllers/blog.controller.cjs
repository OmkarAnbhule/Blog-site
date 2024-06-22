const mongoose = require('mongoose')
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const Blog = require('../models/blog.model.cjs')
const Comment = require('../models/comment.model.cjs')
const { uploadFileOnCloudinary } = require('../utils/cloudinary.utils.cjs')
const { generateOrQuery, traverseObjects } = require('../utils/comment.utils.cjs')


exports.createBlog = async (req, resp) => {
    try {
        const { title, category, desc } = req.body
        const thumbnail = req.files.thumbnail
        const window = new JSDOM('').window;
        const DOMPurifyInstance = DOMPurify(window);
        const content = DOMPurifyInstance.sanitize(req.body.content);
        if (title || category || content || thumbnail || desc) {
            const upload = await uploadFileOnCloudinary(thumbnail, 'blogThumbnails')
            const result = await Blog.create({ title, category, content, thumbnail: upload.secure_url, author: req.user.id, desc: desc })
            if (result) {
                return resp.status(201).send({ success: true, message: 'blog created successfully' })
            }
        }
        else {
            return resp.status(201).send({ success: false, message: 'fields cannot be empty' })
        }
    }
    catch (e) {
        console.log(e)
        return resp.status(500).send({ success: false, message: 'internal server error' });
    }
}

exports.getAllBlogs = async (req, resp) => {
    try {
        const blogs = await Blog.find().populate('author', 'name').sort({ viewsCount: -1 });
        if (blogs)
            return resp.status(201).send({ success: true, data: blogs })
    } catch (error) {
        console.log(error)
        return resp.status(500).send({ success: false, message: 'internal server error' });
    }
}

exports.getRecentBlogs = async (req, resp) => {
    try {
        const blogs = await Blog.find().populate('author', 'name').sort({ timeStamp: -1 }).limit(10);
        if (blogs) {
            return resp.status(201).send({ success: true, data: blogs })
        }
    } catch (error) {
        return resp.status(500).send({ success: false, message: 'internal server error' })
    }
}

exports.getPopularBlogs = async (req, resp) => {
    try {
        const blogs = await Blog.find().populate('author', 'name').sort({ viewsCount: -1 }).limit(10);
        if (blogs) {
            return resp.status(201).send({ success: true, data: blogs })
        }
    } catch (error) {
        return resp.status(500).send({ success: true, message: 'internal server error' })
    }
}

exports.getBlog = async (req, resp) => {
    try {
        const { blogId } = req.params
        if (blogId) {
            const blog = await Blog.findById(blogId).populate('author', 'name avatar');
            return resp.status(201).send({ success: true, data: blog })
        }
    } catch (error) {
        return resp.status(500).send({ success: false, message: 'internal server error' })
    }
}

exports.getBlogs = async (req, resp) => {
    try {
        const { userId } = req.params
        if (userId) {
            const blog = await Blog.find({ author: userId }).populate('author', 'name')
            return resp.status(201).send({ success: true, data: blog })
        }
    }
    catch (e) {
        return resp.status(500).send({ success: false, message: 'internal server error' })
    }
}

exports.getQueryBlogs = async (req, resp) => {
    try {
        const { searchText } = req.params
        const regex = new RegExp(searchText, 'i');

        let blogs = await Blog.find({
            $or: [
                { title: { $regex: regex } },
                { category: { $regex: regex } }
            ]
        }).populate('author', 'name');
        if (blogs) {
            return resp.status(201).send({ success: true, data: blogs })
        }
    }
    catch (err) {
        console.log(err)
        return resp.status(500).send({ success: false, message: 'internal server error' })
    }
}

exports.addView = async (req, resp) => {
    try {
        const { blogId } = req.params
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return resp.status(500).send({ success: false, message: 'blog not found' });
        }
        if (!blog.views.includes(req.user.id) && blog.author.toString() != req.user.id) {
            blog.views.push(req.user.id);
            blog.viewsCount = blog.views.length;
            await blog.save();
            return resp.status(201).send({ success: true })
        }
        return resp.status(200).send({ success: false })
    } catch (error) {
        console.error(error);
    }
};


exports.addComment = async (req, resp) => {
    try {
        const { comment, type, blogId, name } = req.body;
        if (type === 'comment') {
            const result = await Comment.create({ comment, name, blogId, id: req.user.id });
            if (result) {
                resp.status(201).send({ success: true })
            }
        }
        else {
            const levelsOfNesting = req.body.level;
            const orQuery = generateOrQuery(req.body.objId, levelsOfNesting);
            const obj = await Comment.find({ $or: orQuery })
            const arr = await traverseObjects(obj, req, 'reply', null)
            const result = await Comment.findByIdAndUpdate(obj[0]._id, { isReply: arr[0].isReply, replyCount: arr[0].replyCount, Replies: arr[0].Replies });
            if (obj && result) {
                resp.status(201).send({ success: true })
            }
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.getComments = async (req, resp) => {
    try {
        const comments = await Comment.find({ blogId: req.params.id });
        if (comments) {
            resp.status(201).send({ success: true, data: comments })
        }
        else {
            resp.status(201).send({ success: true, data: [] })
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ success: false, message: 'internal server error' });
    }
}

exports.deleteComment = async (req, resp) => {
    try {
        if (req.params.level == 0) {
            const result = await Comment.findByIdAndDelete(req.params.id);
            if (result) {
                resp.status(201).send({ success: true });
            }
        }
        else {
            const orQuery = generateOrQuery(req.params.id, req.params.level);
            const obj = await Comment.find({ $or: orQuery });
            const arr = traverseObjects(obj, req, 'reply', 'delete');
            const result = await Comment.findByIdAndUpdate(obj[0]._id, { Replies: arr[0].Replies });
            if (result) {
                resp.status(201).send({ success: true })
            }
            else {
                resp.status(400).send({ success: false })
            }
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ success: false, message: 'internal server error' });
    }
}