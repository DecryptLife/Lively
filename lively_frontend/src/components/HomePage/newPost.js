import { useState, useRef } from "react";

const NewPost = ({ handlePost }) => {
  const [postContent, setPostContent] = useState("");

  const inputref = useRef(null);
  const [addImage, setAddImage] = useState("Add Image");
  const handleClick = () => {
    inputref.current.click();
  };

  const [postImage, setPostImage] = useState("");
  const handleChange = (e) => {
    const fileObj = e.target.files && e.target.files[0];

    if (!fileObj) {
      return;
    } else {
      setAddImage(fileObj.name);
      transformFile(fileObj);
    }
  };

  const transformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPostImage(reader.result);
      };
    } else {
      setPostImage("");
    }
  };

  const handleCancel = () => {
    setAddImage("Add Image");
    setPostContent("");
  };

  const clearPost = () => {
    setPostContent("");
  };
  return (
    <div className="addPostLayout">
      <div className="newPostLayout">
        <div className="imagePostContainer">
          <div className="addImage" id="addImageLayout">
            <input
              style={{ display: "none" }}
              type="file"
              ref={inputref}
              onChange={handleChange}
            ></input>
            <button className="addImageBtn" onClick={() => handleClick()}>
              {addImage}
            </button>
          </div>
          <div className="addPost">
            <textarea
              className="addPostField"
              placeholder="Post new content"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="postBtnLayout">
        <div className="postBtnsContainer">
          <button className="cancelPostBtn" onClick={() => handleCancel()}>
            Cancel
          </button>
          <button
            className="postBtn"
            onClick={() => {
              handlePost(postContent, setPostContent, postImage, setPostImage);
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
