import { Schema, model } from "mongoose";
import { Comment } from "../models/comment";

const CommentSchema = new Schema<Comment>(
  {
    author: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    posted: { type: String, required: true },
    topic: { type: String, trim: true }
  },
  { collection: "comments" }
);

const CommentModel = model<Comment>("Comment", CommentSchema);

function index(): Promise<Comment[]> {
  return CommentModel.find().sort({ posted: -1 });
}

function get(id: string): Promise<Comment> {
  return CommentModel.findById(id)
    .then((comment) => {
      if (!comment) throw `${id} Not Found`;
      return comment;
    })
    .catch((err) => {
      throw `${id} Not Found`;
    });
}

function create(json: Comment): Promise<Comment> {
  const comment = new CommentModel(json);
  return comment.save();
}

function update(id: string, comment: Comment): Promise<Comment> {
  return CommentModel.findByIdAndUpdate(id, comment, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated as Comment;
  });
}

function remove(id: string): Promise<void> {
  return CommentModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };
