const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Dogs', 'Cats', 'Diet', 'Lifestyle', 'Vet']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

blogSchema.plugin(require('./plugins/paginate.plugin'));

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog; 