import { useState, useRef, Dispatch, SetStateAction, ChangeEvent } from "react";
import { addPost } from "../../API/homeAPI";
import { memo } from "react";

interface NewPostProps {
  setUserState: Dispatch<SetStateAction<IUserState | null>>;
}

interface IPostContent {
  text: string;
  image: string;
}

const NewPost: React.FC<NewPostProps> = memo(({ setUserState }) => {
  console.log("new post rendered");
  const [imageText, setImageText] = useState("Add image");
  const [postContent, setPostContent] = useState<IPostContent>({
    image: "",
    text: "",
  });

  const inputref = useRef<HTMLInputElement | null>(null);
  const handleImageSelect = () => {
    if (inputref.current) inputref.current.click();
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files && e.target.files[0];

    if (!fileObj) {
      return;
    } else {
      setImageText(fileObj.name);
      transformFile(fileObj);
    }
  };

  const transformFile = (file: File) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPostContent((prev) => {
          if (!prev) return prev;
          return { ...prev, image: reader.result as string };
        });
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

      // setArticles((prev) => [newPost, ...prev]);

      setUserState((prev) => ({
        ...prev,
        articles: [newPost, ...prev.articles],
      }));

      handleReset();
    } catch (err: unknown) {
      if (err instanceof Error) console.log("Add Post Error: ", err.message);
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
