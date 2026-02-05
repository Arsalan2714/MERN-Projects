import CommentForm from "./CommentForm";
import formatDate  from "../util/dateUtil";
import { useContext } from "react";
import { BlogContext } from "../store/BlogContext";

const Blog = ({ blog }) => {

  const { updateBlog, deleteBlog } = useContext(BlogContext);

  const handleLike = () => {
    fetch(`http://localhost:3001/api/blogs/${blog._id}/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        updateBlog(resJson.blog);
      });

  }
  const handleDelete = () => {
      fetch(`http://localhost:3001/api/blogs/${blog._id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson) => {
        deleteBlog(blog._id);
      });
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden my-8 border border-slate-200">
      {/* Blog header */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">{blog.title}</h1>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
            { formatDate (blog.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-slate-600 font-medium">
            By <span className="text-blue-600">{blog.author}</span>
          </span>
        </div>
      </div>
      {/* Blog content */}
      <div className="px-6 pb-4">
        <p className="text-lg text-slate-700 mb-6 whitespace-pre-line">
          {blog.content || blog.context}
        </p>
        {/* Actions */}
        <div className="flex items-center gap-4 mb-4">
          <button className="flex items-center px-4 py-1 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition" onClick={handleLike}>
            👍 Like <span className="ml-2">{blog.likes}</span>
          </button>
          <button className="flex items-center px-4 py-1 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition" onClick={handleDelete}>
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-slate-50 px-6 py-5 border-t">
        <h2 className="text-lg font-bold text-slate-700 mb-3">Comments</h2>
        <div className="space-y-4 mb-6">
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((comment) => (
              <div key={comment._id} className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-blue-700 mr-3">{comment.username}</span>
                  <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-slate-700">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic">No comments yet. Be the first!</p>
          )}
        </div>
        <CommentForm />
      </div>
    </div>
  );
};

export default Blog