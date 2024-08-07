import { useState, useEffect } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa"; // Example using react-icons

const ShowPosts = ({
  articles,
  handleOptionsClick,
  handleCommentsClick,
  handleAddComment,
  comment,
  setComment,
  newUser,
  followers,
  handleFollowers,
  currentPage,
}) => {
  const [postFeaturesDisplayed, setPostFeatureDisplayed] = useState({
    comments: false,
    options: false,
  });

  const [postCommentID, setPostCommentID] = useState("");

  const NoPosts = () => {
    return (
      <div>
        <h2>No posts yet!</h2>
      </div>
    );
  };

  const convertISOString = (iso_string) => {
    const date = new Date(iso_string);
    const readableTime = date.toLocaleString();
    return readableTime;
  };

  useEffect(() => {
    if (postCommentID !== "") {
      postFeaturesDisplayed((prev) => ({
        ...prev,
        comments: !prev.comments,
      }));
    }
  }, [postCommentID]);

  useEffect(() => {
    if (postFeaturesDisplayed.options) {
    }
  }, [postFeaturesDisplayed.options]);
  return (
    <div className="posts-container">
      {articles.length > 0 &&
        articles.map((article) => {
          return (
            <div className="post-item" key={article._id}>
              <div className="post-header">
                <img
                  className="post-header-img"
                  src={article.author_image && article.author_image}
                ></img>
                <div className="post-header-details">
                  <span style={{ fontWeight: "bold" }}>{article.author}</span>
                  <span style={{ fontWeight: "lighter" }}>
                    {convertISOString(article.date)}
                  </span>
                </div>
              </div>
              <div className="post-text-container">{article.text}</div>
              <div className="post-image-container">
                <img className="post-image" src={article.image.url}></img>
              </div>
              <div className="post-features-container">
                <div
                  className="comments-container"
                  onClick={() => handleCommentsClick(article._id)}
                >
                  <span>Comment</span>

                  {article.commentsDisplayed ? <FaArrowDown /> : <FaArrowUp />}
                </div>
                <div
                  className="options-container"
                  data-id="2345"
                  onClick={() => handleOptionsClick(article)}
                >
                  <span>Options</span>
                </div>
              </div>
              {article.commentsDisplayed && (
                <div className="comments-list">
                  {article.comments?.map((comment) => (
                    <div className="comment-item-container">
                      <div className="comment-item__img-container">
                        <img
                          className="comment-item__img"
                          width={40}
                          height={40}
                          src={comment.author_image}
                        ></img>
                      </div>
                      <div className="comment-item-details">
                        <span className="comment-item__author">
                          {comment.author}
                        </span>
                        <span className="comment-item__content">
                          {comment.comment}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="add-comment-layout">
                    <input
                      className="add-comment__input"
                      placeholder="Add a comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></input>
                    <button
                      className="post-comment__btn"
                      onClick={() => handleAddComment(article._id, comment)}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ShowPosts;

// <div className="comments-list">
//                   <div className="comment-item-container">
//                     <div className="comment-item__img-container">
//                       <img
//                         className="comment-item__img"
//                         width={40}
//                         height={40}
//                       ></img>
//                     </div>
//                     <div className="comment-item-details">
//                       <span className="comment-item__author">author</span>
//                       <span className="comment-item__content">
//                         This is a comment
//                       </span>
//                     </div>
//                   </div>
//                   <div className="comment-item-container">
//                     <div className="comment-item__img-container">
//                       <img
//                         className="comment-item__img"
//                         width={40}
//                         height={40}
//                       ></img>
//                     </div>
//                     <div className="comment-item-details">
//                       <span className="comment-item__author">author</span>
//                       <span className="comment-item__content">
//                         This is a comment
//                       </span>
//                     </div>
//                   </div>
//                   <div className="comment-item-container">
//                     <div className="comment-item__img-container">
//                       <img
//                         className="comment-item__img"
//                         width={40}
//                         height={40}
//                       ></img>
//                     </div>
//                     <div className="comment-item-details">
//                       <span className="comment-item__author">author</span>
//                       <span className="comment-item__content">
//                         This is a comment
//                       </span>
//                     </div>
//                   </div>

// const url = (path) => `${BASE_URL}${path}`;
// const totalPosts = articles;
// const [updatedPID, setUpdatedPID] = useState("");

// const [updatedText, setUpdatedText] = useState("");
// const [updatedImage, setUpdatedImage] = useState("");
// const [updatedImageURL, setUpdatedImageURL] = useState("");

// const [postsPerPage, setPostsPerPage] = useState(10);
// useEffect(() => {});
// const [commentMod, setCommentMod] = useState(false);
// const [updateCmntPstID, setUpdateCmntPstID] = useState("");
// const [updateCmntID, setUpdateCmntID] = useState("");
// const [updateCommentVal, setUpdateCommentVal] = useState("");
// const [comment, setComment] = useState("");

// const addComment = async (e, pid) => {
//   const addCommentField = document.getElementById(`comments_${pid}`);
//   const text = addCommentField.value;
//   let new_comment = { comment_id: -1, text: text };
//   const comment_field = document.getElementsByClassName("comment_field");

//   const post = comment_field[pid];

//   if (text.length > 0) {
//     await axios.put(url(`/articles/${pid}`), new_comment, {
//       headers: { "Content-Type": "application/json" },
//     });

//     post.style.display = post.style.display === "block" ? "none" : "block";
//     addCommentField.value = "";
//     setCommentMod(true);
//   }
// };

// const showComments = (e) => {
//   const comment_field = document.getElementsByClassName("comment_field");

//   const post = comment_field[e.target.value - 1];

//   post.style.display = post.style.display === "block" ? "none" : "block";
// };

// const editPost = (e) => {
//   const pid = e.target.id;
//   setUpdatedPID(pid);
//   const dialog = document.getElementById("updatePostDialog");
//   const closeDialog = document.getElementById("cancelPostUpdateBtn");
//   const updatePost = document.getElementById("updatePostBtn");
//   if (typeof dialog.showModal === "function") {
//     dialog.showModal();
//   }

//   closeDialog.addEventListener("click", () => {
//     dialog.close();
//   });
// };

// const modifyComment = (e) => {
//   setUpdateCmntID(e.target.id);
//   setUpdateCmntPstID(e.target.value);
//   const commentDialog = document.getElementById("commentDialog");
//   const closeCommentDialog = document.getElementById("closeCommentDialogBtn");

//   if (typeof commentDialog.showModal === "function") {
//     commentDialog.showModal();
//   }

//   closeCommentDialog.addEventListener("click", () => {
//     commentDialog.close();
//   });
// };

// useEffect(() => {
//   let post_field = [];
//   let count = 0;
//   if (totalPosts) {
//     totalPosts.forEach((post) => {
//       count++;
//       var postComment = post["comments"];
//       let comment_field = [];
//       let comment_count = 0;
//       if (postComment.length > 0) {
//         postComment.forEach((comment) => {
//           comment_count++;
//           comment_field.push(
//             <div className="commentField" key={comment_count}>
//               <span>{comment}</span>
//               <button
//                 id={comment_count}
//                 value={post["pid"]}
//                 onClick={(e) => {
//                   modifyComment(e);
//                 }}
//               >
//                 Modify
//               </button>
//             </div>
//           );
//         });
//       }
//       post_field.push(
//         <div className="post-item" key={post["pid"]} style={{}}>
//           <span className="greenText">{}</span>
//           {!(post["newPost"] === "true") && (
//             <img
//               className="bgImg"
//               src={post["image"] ? post.image.url : req[1]}
//             ></img>
//           )}
//           {post["newPost"] === "true" && <img className="bgImg"></img>}

//           <span className="greenText">{post["author"]}</span>
//           <div className="content">
//             <div className="postContent">
//               {/* <h2>{post["title"]}</h2> */}
//               <p>{post["text"]}</p>
//             </div>

//             <div className="btnLayout">
//               <button
//                 className="postCmntBtn"
//                 id={post["pid"]}
//                 value={count}
//                 onClick={(e) => showComments(e)}
//               >
//                 Comment
//               </button>
//               <button
//                 className="postEditBtn"
//                 id={post["pid"]}
//                 value={count}
//                 onClick={(e) => {
//                   editPost(e);
//                 }}
//               >
//                 Edit
//               </button>
//             </div>
//             {/* <div className="all_comments">{comment_field}</div> */}
//             <div
//               className="comment_field"
//               id={post["pid"]}
//               style={{ display: "none" }}
//             >
//               {comment_field}
//               <br></br>
//               <input
//                 type="text"
//                 id={`comments_${post["pid"]}`}
//                 placeholder="Add comment"
//               ></input>
//               <button
//                 id={`postComment${post["pid"]}`}
//                 onClick={(e) => {
//                   addComment(e, post["pid"]);
//                 }}
//               >
//                 Add
//               </button>
//             </div>
//             <div className="postedTimeLayout">
//               {<span className="greenText">{post["date"]}</span>}
//             </div>
//           </div>
//         </div>
//       );
//     });
//     setPostField(post_field);
//   }
// }, [totalPosts, commentMod]);

// useEffect(() => {
//   if (searchPost !== "") {
//     let search_post = [];
//     let count = 0;
//     articles.map((post) => {
//       if (
//         post["author"].match(searchPost) ||
//         post["text"].match(searchPost)
//       ) {
//         count++;
//         var postComment = post["comments"];
//         let comment_field = [];
//         let comment_count = 0;
//         if (postComment.length > 0) {
//           postComment.forEach((comment) => {
//             comment_count++;
//             comment_field.push(
//               <div className="commentField" key={comment_count}>
//                 <span>{comment}</span>
//                 <button
//                   id={comment_count}
//                   value={post["pid"]}
//                   onClick={(e) => {
//                     modifyComment(e);
//                   }}
//                 >
//                   Modify
//                 </button>
//               </div>
//             );
//           });
//         }
//         search_post.push(
//           <div className="Post" key={post["pid"]} style={{}}>
//             <span className="greenText">{}</span>
//             {!(post["newPost"] === "true") && (
//               <img
//                 className="bgImg"
//                 src={post["image"] ? post.image.url : req[1]}
//               ></img>
//             )}
//             {post["newPost"] === "true" && <img className="bgImg"></img>}

//             <span className="greenText">{post["author"]}</span>
//             <div className="content">
//               <div className="postContent">
//                 {/* <h2>{post["title"]}</h2> */}
//                 <p>{post["text"]}</p>
//               </div>

//               <div className="btnLayout">
//                 <button
//                   className="postCmntBtn"
//                   id={post["pid"]}
//                   value={count}
//                   onClick={(e) => showComments(e)}
//                 >
//                   Comment
//                 </button>
//                 <button
//                   className="postEditBtn"
//                   id={post["pid"]}
//                   value={count}
//                   onClick={(e) => {
//                     editPost(e);
//                   }}
//                 >
//                   Edit
//                 </button>
//               </div>
//               <div
//                 className="comment_field"
//                 id={post["pid"]}
//                 style={{ display: "none" }}
//               >
//                 {comment_field}
//                 <br></br>
//                 <input
//                   type="text"
//                   id={`comments_${post["pid"]}`}
//                   placeholder="Add comment"
//                 ></input>
//                 <button
//                   id={`postComment${post["pid"]}`}
//                   onClick={(e) => {
//                     addComment(e, post["pid"]);
//                   }}
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="postedTimeLayout">
//                 {<span className="greenText">{post["date"]}</span>}
//               </div>
//             </div>
//           </div>
//         );
//       }
//     });
//     if (search_post.length > 0) {
//       setCurrentPosts(search_post);
//     }
//   } else {
//     setCurrentPosts(postfield);
//   }
// }, [searchPost]);

// const [postfield, setPostField] = useState(null);
// const [currentPosts, setCurrentPosts] = useState(null);
// const indexOfLastPost = currentPage * postsPerPage;
// const indexofFirstPost = indexOfLastPost - postsPerPage;

// useEffect(() => {
//   if (postfield !== null) {
//     setCurrentPosts(postfield.slice(indexofFirstPost, indexOfLastPost));
//   }
// }, [postfield, currentPage]);

// const updateComment = async () => {
//   const commentDialog = document.getElementById("commentDialog");
//   const comment_field = document.getElementsByClassName("comment_field");
//   const post = comment_field[updateCmntPstID];
//   if (updateCommentVal !== "") {
//     let commentDetails = { comment_id: updateCmntID, text: updateCommentVal };

//     await axios.put(url(`/articles/${updateCmntPstID}`), commentDetails, {
//       withCredentials: true,
//       headers: { "Content-Type": "application/json" },
//     });

//     setCommentMod(true);
//     commentDialog.close();
//     post.style.display = post.style.display === "block" ? "none" : "block";
//     setUpdateCmntID("");
//     setUpdateCmntPstID("");
//     setUpdateCommentVal("");
//   }
// };

// const updatePost = async () => {
//   const dialog = document.getElementById("updatePostDialog");
//   const textField = document.getElementById("modPostText");
//   const imageField = document.getElementById("modPostImg");

//   let postUpdate;
//   if (updatedImage) {
//     const reader = new FileReader();
//     reader.readAsDataURL(updatedImage);
//     reader.onloadend = () => {
//       let imageURL = reader.result;
//       if (updatedText) {
//         postUpdate = { text: updatedText, image: imageURL };
//       } else {
//         postUpdate = { image: imageURL };
//       }
//     };
//   } else {
//     postUpdate = { text: updatedText };
//   }

//   await axios.put(url(`/articles/${updatedPID}`), postUpdate, {
//     withCredentials: true,
//     headers: { "Content-Type": "application/json" },
//   });

//   textField.value = "";
//   imageField.value = "";
//   setUpdatedPID("");
//   setUpdatedImage("");
//   setUpdatedText("");
//   setUpdatedImageURL("");
//   setNewPost("");
//   dialog.close();
// };

// <div className="posts-container">
//   {totalPosts.length === 0 || totalPosts === undefined ? (
//     <h3>No posts yet</h3>
//   ) : (
//     currentPosts
//   )}
//   <dialog id="updatePostDialog">
//     <h4>Modify the Post</h4>
//     <label htmlFor="modPostText">New body</label>
//     <br />
//     <input
//       type="text"
//       className="modPostText"
//       id="modPostText"
//       placeholder="Enter the new text"
//       value={updatedText}
//       onChange={(e) => setUpdatedText(e.target.value)}
//     ></input>
//     <br></br>
//     <br></br>
//     <label htmlFor="modPostImg">New Image</label>
//     <br></br>
//     <input
//       type="file"
//       id="modPostImg"
//       name="modPostImg"
//       accept="image/*"
//       onChange={(e) => setUpdatedImage(e.target.files && e.target.files[0])}
//     ></input>
//     <br></br>
//     <br></br>
//     <h6>(You can modify this post only if you own it)</h6>
//     <button id="updatePostBtn" onClick={(e) => updatePost()}>
//       Update
//     </button>
//     <button id="cancelPostUpdateBtn">Cancel</button>
//   </dialog>

//   <dialog id="commentDialog">
//     <h4>Update the comment</h4>
//     <br></br>
//     <label htmlFor="updateCommentField"></label>
//     <input
//       type="text"
//       placeholder="Modify comment"
//       value={updateCommentVal}
//       onChange={(e) => setUpdateCommentVal(e.target.value)}
//     ></input>
//     <br></br>
//     <br></br>
//     <button id="commentUpdate" onClick={() => updateComment()}>
//       Update
//     </button>
//     <button id="closeCommentDialogBtn">Cancel</button>
//   </dialog>
// </div>
