const postService = require('../services/postServices');

exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || null;
        const limit = parseInt(req.query.limit) || null;

        const result = await postService.getAllPosts(page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Lỗi lấy danh sách bài viết", error: error.message });
    }
};
// API tìm kiếm bài viết theo tên (title)
exports.searchPostsByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) return res.status(400).json({ message: 'Vui lòng nhập tiêu đề để tìm kiếm' });

        const posts = await postService.searchPostsByTitle(title);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.activatePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // Lấy trạng thái từ request body
  
      if (![1, 2].includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
      }
  
      const updatedPost = await postService.activatePost(id, status);
      console.log(updatedPost)
      res.json({ message: "Cập nhật trạng thái thành công!", post: updatedPost });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
exports.getPostById = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPostBySlug = async (req, res) => {
    try {
        const slug = req.params.slug; // Lấy giá trị slug
        if (!slug) return res.status(400).json({ message: "Slug không hợp lệ" });

        const post = await postService.getPostBySlug(slug); // Truyền slug trực tiếp, không truyền object
        if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

        res.json(post);
    } catch (err) {
        console.error("Lỗi API getPostBySlug:", err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

exports.getNewestPosts = async (req, res) => {
    try {
        const posts = await postService.getNewestPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getHotPosts = async (req, res) => {
    try {
        const posts = await postService.getHotPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



///api clientclient
exports.getNewestFourPostsFooter = async (req, res) => {
    try {
        const posts = await postService.getNewestFourPostsFooter();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNewestFourPosts = async (req, res) => {
    try {
        const posts = await postService.getNewestFourPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// API lấy 4 bài viết hot
exports.getHotPosts4 = async (req, res) => {
    try {
        const posts = await postService.getHotPosts4();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// API lấy tất cả bài viết với các trường 'title', 'create_at', 'imageSummary', và 'content'
exports.getAllPostsSummary = async (req, res) => {
    try {
        const posts = await postService.getAllPostsSummary();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


////.....////



exports.createPost = async (req, res) => {
    try {
        const { title, content, summary, imageSummary, author, status, hot, view } = req.body;
        
        // Kiểm tra xem dữ liệu cần thiết có đầy đủ không
        if (!title || !content || !author) {
            return res.status(400).json({ message: 'Thiếu dữ liệu cần thiết' });
        }

        // Gọi service để tạo bài viết mới
        const newPost = await postService.createPost({
            title,
            content,
            summary,
            imageSummary,
            
            
            author,
            status,
            hot,
            view
        });

        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { title, content, summary, imageSummary, author, status, hot } = req.body;

        const updatedPost = await postService.updatePost(req.params.id, {
            title,
            content,
            summary,
            imageSummary,
           
            
            author,
            status,
            hot
        });

        if (!updatedPost) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const deletedPost = await postService.deletePost(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        res.json({ message: 'Bài viết đã được xóa' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
