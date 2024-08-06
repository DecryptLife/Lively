import { useState, useRef } from "react";
import { addPost } from "../../API/homeAPI";

const NewPost = ({ user, setArticles }) => {
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
      author: user.username,
      author_image: user.avatar,
      text: postContent.text,
      post_image: postContent.image,
    };
    try {
      const newPost = await addPost(newArticle);

      console.log("New post: ", newPost);

      setArticles((prev) => [newPost, ...prev]);
    } catch (err) {
      console.log("Add Post Error: ", err.message);
    }
  };

  const handleReset = () => {
    setImageText("Add image");
    setPostContent({ image: "", text: "" });
  };

  return (
    <div className="add-post-container">
      <div className="add-post__content">
        <div className="add-post__image">
          <input
            style={{ display: "none" }}
            type="file"
            ref={inputref}
            onChange={(e) => handleFileSelect(e)}
          ></input>
          <button className="addImageBtn" onClick={() => handleImageSelect()}>
            {imageText}
          </button>
        </div>
        <div className="add-post__text">
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
    // <div className="addPostLayout">
    //   <div className="newPostLayout">
    //     <div className="imagePostContainer">
    //       <div className="addImage" id="addImageLayout">
    //         <input
    //           style={{ display: "none" }}
    //           type="file"
    //           ref={inputref}
    //           onChange={handleChange}
    //         ></input>
    //         <button className="addImageBtn" onClick={() => handleClick()}>
    //           {addImage}
    //         </button>
    //       </div>
    //       <div className="addPost">
    //         <textarea
    //           className="addPostField"
    //           placeholder="Post new content"
    //           value={postContent}
    //           onChange={(e) => setPostContent(e.target.value)}
    //         ></textarea>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="postBtnLayout">
    //     <div className="postBtnsContainer">
    //       <button className="cancelPostBtn" onClick={() => handleCancel()}>
    //         Cancel
    //       </button>
    //       <button
    //         className="postBtn"
    //         onClick={() => {
    //           handlePost(postContent, setPostContent, postImage, setPostImage);
    //         }}
    //       >
    //         Post
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default NewPost;
