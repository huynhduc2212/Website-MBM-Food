const mongoose = require('mongoose');

const postCommentSchema = new mongoose.Schema({
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id_post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    comment: { type: String, required: true },
    hidden: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post_Comment', postCommentSchema);
