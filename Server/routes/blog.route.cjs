const { createBlog, getRecentBlogs, getPopularBlogs, getBlog, getAllBlogs, addComment, deleteComment, getComments, addView, getBlogs, getQueryBlogs } = require('../controllers/blog.controller.cjs')
const { auth } = require('../middlewares/auth.cjs')

const router = require('express').Router()

router.post('/create', auth, createBlog)
router.get('/getAllBlogs', auth, getAllBlogs)
router.get('/recentBlog', auth, getRecentBlogs)
router.get('/popularBlog', auth, getPopularBlogs)
router.get('/getBlogs/:userId', auth, getBlogs)
router.get('/getQueryBlog/:searchText', auth, getQueryBlogs)
router.get('/:blogId', auth, getBlog)
router.put('/addView/:blogId', auth, addView)
router.post('/addComment', auth, addComment)
router.delete('/deleteComment/:id/:level', auth, deleteComment)
router.get('/getComments/:id', auth, getComments)

module.exports = router;