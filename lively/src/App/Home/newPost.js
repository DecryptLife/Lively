import { useState, useRef } from "react";

const NewPost = ({ handlePost }) => {
  const [postContent, setPostContent] = useState("");

  const inputref = useRef(null);

  const handleClick = () => {
    inputref.current.click();
  };

  const handleChange = (e) => {
    const fileObj = e.target.files && e.target.files[0];

    if (!fileObj) {
      return;
    }

    // console.log("fileObj is", fileObj);

    // 👇️ reset file input
    // e.target.value = null;

    // 👇️ is now empty
    // console.log(e.target.files);

    // 👇️ can still access file object here
    // console.log(fileObj);
    // console.log(fileObj.name);
  };

  const handleCancel = () => {
    setPostContent("");
  };

  const clearPost = () => {
    setPostContent("");
  };
  return (
    <div className="addPostLayout">
      <div className="newPostLayout">
        <div className="imagePostContainer">
          <div className="addImage">
            <input
              style={{ display: "none" }}
              type="file"
              ref={inputref}
              onChange={handleChange}
            ></input>
            <button className="addImageBtn" onClick={() => handleClick()}>
              Add image
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
              handlePost(postContent, setPostContent);
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
