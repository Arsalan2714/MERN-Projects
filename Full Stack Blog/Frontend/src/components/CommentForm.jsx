
const CommentForm = () => {
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
          className="mt-2 px-4 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </label>
      <label className="flex flex-col text-slate-700 font-medium">
        Comment
        <textarea
          placeholder="Share your thoughts..."
          rows={4}
          className="mt-2 px-4 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
        />
      </label>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition active:scale-95 mt-2 tracking-wide w-fit"
      >
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;