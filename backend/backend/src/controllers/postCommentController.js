const PostCommentService = require('../services/postCommentService');

class PostCommentController {
    async createComment(req, res) {
        try {
            const { postId, comment } = req.body;
            const userId = req.userId; // Lấy từ middleware hoặc localStorage trên frontend
            
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const newComment = await PostCommentService.createComment(userId, postId, comment);
            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllComments(req, res) {
        try {
            const comments = await PostCommentService.getAllComments();
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCommentsByPost(req, res) {
        try {
            const { postId } = req.params;
            const comments = await PostCommentService.getCommentsByPost(postId);
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCommentsByUser(req, res) {
        try {
            const userId = req.params.userId;
            const comments = await PostCommentService.getCommentsByUser(userId);
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteComment(req, res) {
        try {
            const { commentId } = req.params;
            const userId = req.userId; // Lấy từ middleware hoặc localStorage trên frontend
            
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            await PostCommentService.deleteComment(commentId, userId);
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async hideComment(req, res) {
        try {
            const { commentId } = req.params;
            const updatedComment = await PostCommentService.hideComment(commentId);
            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PostCommentController();
