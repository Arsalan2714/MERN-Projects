import { useRef } from "react";

const CreateBlog = () => {
  const titleRef = useRef();
  const contentRef = useRef();
  const authorRef = useRef();

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const content = contentRef.current.value;
    const author = authorRef.current.value;

    fetch("http://localhost:3001/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
        author: author,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson.blog);
        titleRef.current.value = "";
        contentRef.current.value = "";
        authorRef.current.value = "";
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-tr from-slate-100 to-slate-300 py-10">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8">
        <h2 className="text-2xl font-bold mb-5 text-center text-slate-800">
          ✍️ Share Your Blog Post!
        </h2>

        <form className="flex flex-col gap-6" onSubmit={handleCreateBlog}>
          <label className="flex flex-col font-medium text-slate-700">
            Title
            <input
              type="text"
              placeholder="Give an catchy title to your blog"
              ref={titleRef}
              className="mt-2 px-4 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>

          <label className="flex flex-col font-medium text-slate-700">
            Content
            <textarea
              name="content"
              id="content"
              placeholder="Let your creativity flow..."
              ref={contentRef}
              rows={7}
              className="mt-2 px-4 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            ></textarea>
          </label>

          <label className="flex flex-col font-medium text-slate-700">
            Author
            <input
              type="text"
              placeholder="Enter your name"
              ref={authorRef}
              className="mt-2 px-4 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition active:scale-95 mt-2 tracking-wide"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;