import { useState, useRef } from "react";
import { addPost } from "../../API/homeAPI";
import { memo } from "react";

const NewPost = memo(({ user, setArticles }) => {
  console.log("new post rendered");
  const [imageText, setImageText] = useState("Add image");
  const [postContent, setPostContent] = useState({
    image: "",
    text: "",
  });

  const inputref = useRef(null);
  const handleImageSelect = () => {
    inputref.current.click();
  };

  const handleFileSelect = (e) => {
    const fileObj = e.target.files && e.target.files[0];

    if (!fileObj) {
      return;
    } else {
      setImageText(fileObj.name);
      transformFile(fileObj);
    }
  };

  const transformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPostContent((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
    } else {
      setPostContent((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const handleAddPost = async () => {
    const newArticle = {
      text: postContent.text,
      post_image: postContent.image,
    };
    try {
      const newPost = await addPost(newArticle);

      setArticles((prev) => [newPost, ...prev]);

      handleReset();
    } catch (err) {
      console.log("Add Post Error: ", err.message);
    }
  };

  const handleReset = () => {
    setImageText("Add image");
    setPostContent({ image: "", text: "" });
  };

  return (
    <div className="flex-col add-post-container">
      <div className="add-post__content">
        <div style={{ width: "30%" }}>
          <input
            style={{ display: "none" }}
            type="file"
            ref={inputref}
            onChange={(e) => handleFileSelect(e)}
          ></input>
          <button
            className="add-post__image-btn"
            onClick={() => handleImageSelect()}
          >
            {imageText}
          </button>
        </div>
        <div style={{ width: "70%" }}>
          <textarea
            placeholder="Add text"
            className="add-post__text-input"
            onChange={(e) =>
              setPostContent((prev) => ({
                ...prev,
                text: e.target.value,
              }))
            }
            value={postContent.text}
          ></textarea>
        </div>
      </div>
      <div className="add-post__buttons">
        <button onClick={() => handleReset()}>Reset</button>
        <button onClick={() => handleAddPost()}>Post</button>
      </div>
    </div>
  );
});

export default NewPost;
