import { useContext, useRef, useState } from "react";
import { BlogContext } from "../store/BlogContext";

const CommentForm = ({blogId}) => {
  const { blog, updateBlog } = useContext(BlogContext);
  const [commenting, sendingCommenting ]=useState(false);

  const usernameRef = useRef(null);
  const commentRef = useRef(null);


  const handleSubmit = (e) => {
    e.preventDefault();
    sendingCommenting(true);
     fetch(`http://localhost:3001/api/blogs/${blogId}/comment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current.value,
        content: commentRef.current.value,
      })
    })
      .then((res) => res.json())
      .then((resJson) => {
        updateBlog(resJson.blog);
      })
      .finally(() => {
        sendingCommenting(false);
        usernameRef.current.value = "";
        commentRef.current.value = "";

      })
  }

  return (
    <form
      className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full"
      autoComplete="off"
      style={{ marginTop: "1.5rem" }}
    >
      <h3 className="text-lg font-semibold text-slate-700 mb-2">Leave a Comment</h3>
      <label className="flex flex-col text-slate-700 font-medium">
        Username
        <input
          type="text"
          placeholder="Enter your name"
          className="mt-2 px-4 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" ref={usernameRef}
        />
      </label>
      <label className="flex flex-col text-slate-700 font-medium">
        Comment
        <textarea
          placeholder="Share your thoughts..."
          rows={4}
          className="mt-2 px-4 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none" ref={commentRef}
        />
      </label>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition active:scale-95 mt-2 tracking-wide w-fit" onClick={handleSubmit}
      >
        {commenting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};

export default CommentForm;