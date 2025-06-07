const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const upload = require("../middleware/uploadImage");

const multerFields = [];
const MAX_VARIANTS = 10; 

for (let i = 0; i < MAX_VARIANTS; i++) {
  multerFields.push({ name: `variants[${i}][image]` });
}


///api client////////
// Lấy các bài viết hot chi title va image
router.get('/posts/hot/4', postController.getHotPosts4);
router.put("/posts/activate/:id", postController.activatePost);
// Lấy 4 bài viết mới nhất
router.get('/posts/newest/4', postController.getNewestFourPosts);
// Lấy 4 bài viết mới nhất footer
router.get('/posts/newest/footer/4', postController.getNewestFourPostsFooter);
// lấy tat ca bai viet voi title imageSummary day contentcontent
router.get('/posts/news',postController.getAllPostsSummary);

//////......///
// tim bai viet theo ten
router.get('/posts/search', postController.searchPostsByTitle);
// Lấy tất cả bài viết
router.get('/posts', postController.getAllPosts);

router.get("/posts/slug/:slug", postController.getPostBySlug);
router.put("/posts/:id/increment-view", postController.incrementView);

// Lấy bài viết theo id
router.get('/posts/:id', postController.getPostById);


// Lấy các bài viết mới nhất
router.get('/posts/newest', postController.getNewestPosts);

// Lấy các bài viết hot
router.get('/posts/hot', postController.getHotPosts);


// Tạo bài viết mới
router.post('/posts',upload.fields(multerFields), postController.createPost);

// Cập nhật bài viết theo id
router.put('/posts/:id',upload.fields(multerFields), postController.updatePost);


// Xóa bài viết theo id
router.delete('/posts/:id', postController.deletePost);

module.exports = router;
