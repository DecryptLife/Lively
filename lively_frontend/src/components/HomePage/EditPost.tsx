// import { useState } from "react";
// import transformImage from "../../utils/transformImage";
// import { updateArticle } from "../../API/homeAPI";

// const EditPost = ({ article, setIsDialogOpen, setUserState }) => {
//   const [editedArticle, setEditedArticle] = useState({
//     text: article ? article.text : "",
//     preview_image: article ? article.image : {},
//     image: "",
//   });

//   const handleEditPost = async () => {
//     if (article.text === editedArticle.text && editedArticle.image === "")
//       return;

//     const modifiedArticle = {
//       ...(editedArticle.text !== article.text && { text: editedArticle.text }),
//       ...(editedArticle.image !== "" && { image: editedArticle.image }),
//     };

//     try {
//       const newArticle = await updateArticle(article._id, modifiedArticle);

//       setUserState((prev) => ({
//         ...prev,
//         articles: prev.articles.map((prevArticle) => {
//           if (prevArticle._id === article._id)
//             return {
//               ...{ author: article.author, avatar: article.avatar },
//               ...newArticle,
//             };
//           else return prevArticle;
//         }),
//       }));
//     } catch (err) {
//       console.log(`Edit post error - ${err.message} :EditPost.js`);
//     } finally {
//       setIsDialogOpen(false);
//     }
//   };

//   const handleImageSelect = async (e) => {
//     try {
//       const [file, image] = await transformImage(e);

//       setEditedArticle((prev) => ({
//         ...prev,
//         preview_image: { url: URL.createObjectURL(file) },
//         image,
//       }));
//     } catch (err) {
//       console.log("Post image edit error: ", err.message);
//     }
//   };

//   return (
//     <div className="post-dialog-layout">
//       <div className="flex-col post-options-dialog">
//         <h2>Edit Post</h2>
//         <div className="dialog-input__field">
//           <input
//             value={editedArticle.text}
//             onChange={(e) =>
//               setEditedArticle((prev) => ({ ...prev, text: e.target.value }))
//             }
//           ></input>
//         </div>
//         <div className="dialog-image__layout">
//           <img
//             src={
//               editedArticle &&
//               editedArticle.preview_image &&
//               editedArticle.preview_image.url
//             }
//             alt="change post"
//             onClick={handleImageSelect}
//           ></img>
//         </div>
//         <div className="flex-col">
//           <label htmlFor="">Change Image: </label>
//           <input type="file" onChange={handleImageSelect} />
//         </div>
//         <div className="dialog-btn__layout">
//           <button onClick={handleEditPost}>Update</button>
//           <button onClick={() => setIsDialogOpen((prev) => !prev)}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditPost;
