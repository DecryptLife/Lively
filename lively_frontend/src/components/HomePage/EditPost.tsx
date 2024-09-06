import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import transformImage from "../../utils/transformImage";
import { updateArticle } from "../../API/homeAPI";

interface PostEditProps {
  article: IDisplayArticle | null;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  setUserState: Dispatch<SetStateAction<IUserState | null>>;
}

interface IEditArticle {
  text: string;
  preview_image: string | object;
  image: string;
}

const EditPost: React.FC<PostEditProps> = ({
  article,
  setIsDialogOpen,
  setUserState,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editedArticle, setEditedArticle] = useState<IEditArticle>({
    text: article?.text || "",
    preview_image: article?.image || {},
    image: "",
  });

  const handleEditPost = async () => {
    if (article) {
      if (article.text === editedArticle.text && editedArticle.image === "")
        return;

      const modifiedArticle = {
        ...(editedArticle.text !== article.text && {
          text: editedArticle.text,
        }),
        ...(editedArticle.image !== "" && { image: editedArticle.image }),
      };

      try {
        const newArticle = await updateArticle(
          article._id || "",
          modifiedArticle
        );

        setUserState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            articles: prev.articles.map((prevArticle) => {
              if (prevArticle._id === article._id)
                return {
                  ...{ author: article.author, avatar: article.avatar },
                  ...newArticle,
                };
              else return prevArticle;
            }),
          };
        });
      } catch (err: unknown) {
        if (err instanceof Error)
          console.log(`Edit post error - ${err.message} :EditPost.js`);
      } finally {
        setIsDialogOpen(false);
      }
    }
  };

  const triggerImageSelect = () => {
    inputRef.current?.click();
  };

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const [file, image] = await transformImage(e);

      setEditedArticle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          preview_image: URL.createObjectURL(file) as string,
          image: image ? (image as string) : "",
        };
      });
    } catch (err: unknown) {
      if (err instanceof Error)
        console.log("Post image edit error: ", err.message);
    }
  };

  return (
    <div className="post-dialog-layout">
      <div className="flex-col post-options-dialog">
        <h2>Edit Post</h2>
        <div className="dialog-input__field">
          <input
            value={editedArticle.text}
            onChange={(e) =>
              setEditedArticle((prev) => ({ ...prev, text: e.target.value }))
            }
          ></input>
        </div>
        <div className="dialog-image__layout">
          <img
            src={(editedArticle && editedArticle.preview_image) || ""}
            alt="change post"
            onClick={triggerImageSelect}
          ></img>

          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            style={{ display: "none" }} // Hide the input
            onChange={handleImageSelect} // Handle image selection
          />
        </div>
        <div className="flex-col">
          <label htmlFor="">Change Image: </label>
          <input type="file" onChange={handleImageSelect} />
        </div>
        <div className="dialog-btn__layout">
          <button onClick={handleEditPost}>Update</button>
          <button onClick={() => setIsDialogOpen((prev) => !prev)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
