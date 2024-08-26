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
}) => {
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

  const isArticleOwner = (authorID) => userDetails._id === authorID;

  return (
    <div className="posts-container">
      {articles.length > 0 ? (
        articles.map((article) => {
          return (
            <div className="post-item" key={article._id}>
              <div className="post-header">
                <img
                  className="post-header-img"
                  alt={`${article.author}'s display`}
                  src={article.avatar || ""}
                ></img>
                <div className="post-header-details">
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
                  alt={`${article.author}'s post`}
                  src={article.image.url}
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
                <div className="comments-list">
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
