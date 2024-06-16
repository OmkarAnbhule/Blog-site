const mongoose = require('mongoose');
const Comment = require('../models/comment.model.cjs');

const generateOrQuery = (id, levels) => {
    const orQuery = [{ _id: new mongoose.Types.ObjectId(id) }];
    for (let i = 0; i < levels; i++) {
        const path = Array(i + 1).fill("Replies").join(".");
        const query = {};
        query[`${path}._id`] = new mongoose.Types.ObjectId(id);
        orQuery.push(query);
    }
    return orQuery;
};
const traverseObjects = (arr, req, type, method) => {
    if (type === 'reply') {
        const data = req.params.id
        if (method === 'delete') {
            arr.forEach(obj => {
                if (obj._id.toString() === data) {
                    const index = arr.indexOf(obj);
                    if (index !== -1) {
                        arr.splice(index, 1);
                    }
                }
                if (obj.Replies && obj.Replies.length > 0) {
                    traverseObjects(obj.Replies, req, type, method);
                }
            });
        }
        else {
            const data = req.body
            const user = req.user
            arr.forEach(obj => {
                if (obj._id.toString() === data.objId) {
                    obj.isReply = true;
                    obj.replyCount = obj.replyCount + 1;
                    obj.Replies.push(new Comment({ comment: data.comment, name: data.name, blogtId: data.blogId, id: user.id }));
                }
                if (obj.Replies && obj.Replies.length > 0) {
                    traverseObjects(obj.Replies, req, type, method);
                }
            });
        }
    }

    return arr;
}

module.exports = { traverseObjects, generateOrQuery };