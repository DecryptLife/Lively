import { useState, useEffect, useMemo, useCallback } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa"; // Example using react-icons

const ShowPosts = ({
  articles,
  handleOptionsClick,
  handleCommentsClick,
  handleAddComment,
  comment,
  setComment,
  handlePostDelete,
  userDetails,
  isLoading,
}) => {
  console.log("show posts rendered");

  const convertISOString = (iso_string) => {
    const date = new Date(iso_string);
    const readableTime = date.toLocaleString();
    return readableTime;
  };

  const isArticleOwner = (authorID) => userDetails._id === authorID;

  return (
    <div
      className="flex-col posts-container"
      style={{
        aspectRatio: "1/1",
      }}
    >
      {isLoading ? (
        <div
          className="flex-col post-item"
          style={{
            height: "100vh",
          }}
        >
          <div className="post-header">
            <div className="flex-col post-header-details">
              <span style={{ fontWeight: "bold" }}></span>
              <span style={{ fontWeight: "lighter" }}></span>
            </div>
          </div>
          <div className="post-text-container"></div>
          <div className="post-image-container"></div>
          <div className="post-features-container"></div>
        </div>
      ) : articles?.length > 0 ? (
        articles.map((article, index) => {
          return (
            <div
              className="flex-col post-item"
              key={article._id + "no: " + { index }}
            >
              <div className="post-header">
                <img
                  className="post-header-img"
                  alt={`${article.author}'s display : ${index}`}
                  src={article.avatar || ""}
                  loading={index === 0 ? "eager" : "lazy"}
                ></img>
                <div className="flex-col post-header-details">
                  <span style={{ fontWeight: "bold" }}>{article.author}</span>
                  <span style={{ fontWeight: "lighter" }}>
                    {convertISOString(article.date)}
                  </span>
                </div>
                {isArticleOwner(article.authorID) && (
                  <button onClick={() => handlePostDelete(article._id)}>
                    Delete
                  </button>
                )}
              </div>
              <div className="post-text-container">{article.text}</div>
              <div className="post-image-container">
                <img
                  className="post-image"
                  alt={`${article.author}'s post: ${index}`}
                  src={article.image.secure_url}
                  loading={index === 0 ? "eager" : "lazy"}
                ></img>
              </div>
              <div className="post-features-container">
                <div
                  className="comments-container"
                  onClick={() => handleCommentsClick(article._id)}
                >
                  <span>Comment</span>

                  {article.commentsDisplayed ? <FaArrowDown /> : <FaArrowUp />}
                </div>
                {isArticleOwner(article.authorID) && (
                  <div
                    className="options-container"
                    data-id="2345"
                    key={article.authorID.date}
                    onClick={() => handleOptionsClick(article)}
                  >
                    <span>Options</span>
                  </div>
                )}
              </div>
              {article.commentsDisplayed && (
                <div className="flex-col comments-list">
                  {article.commentsID?.map((comment) => (
                    <div className="comment-item-container" key={comment.id}>
                      <div className="comment-item__img-container">
                        <img
                          className="comment-item__img"
                          width={40}
                          height={40}
                          src={comment.author_image}
                          alt="comment user profile"
                        ></img>
                      </div>
                      <div className="flex-col comment-item-details">
                        <span className="comment-item__author">
                          {comment.author}
                        </span>
                        <span style={{ fontSize: "medium" }}>
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
        })
      ) : (
        <div>
          <h2>No posts yet!</h2>
        </div>
      )}
    </div>
  );
};

export default ShowPosts;
