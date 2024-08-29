import { useEffect, useMemo, useRef, useState } from "react";
import Status from "./status";
import "./home.css";
import ShowPosts from "./showPosts";
import NewPost from "./newPost";
import Followers from "./Followers";
import AddFriend from "./addFriend";
import { getFollowers } from "../../API/followersAPI";
import EditPost from "./EditPost";
import {
  getUser,
  getArticles,
  addComment,
  deleteArticle,
} from "../../API/homeAPI";

const Home = () => {
  console.log("Home rendered");
  const isInitialMount = useRef(true);
  const [searchPost, setSearchPost] = useState("");
  const [comment, setComment] = useState("");
  const [followersList, setFollowersList] = useState([]);
  const [editArticle, setEditArticle] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [userState, setUserState] = useState({
    userDetails: null,
    followersDetails: [],
    articles: [],
  });

  const handleCommentsClick = (articleID) => {
    setUserState((prev) => ({
      ...prev,
      articles: prev.articles.map((article) => {
        if (article._id === articleID) {
          return {
            ...article,
            commentsDisplayed: !article["commentsDisplayed"],
          };
        }
        return article;
      }),
    }));
  };

  const handleAddComment = async (articleID, newComment) => {
    const commentContent = {
      comment: newComment,
      author: userState.userDetails.username,
      author_image: userState.userDetails.avatar,
    };

    try {
      await addComment(articleID, commentContent);

      setUserState((prev) => ({
        ...prev,
        articles: prev.articles.map((article) => {
          if (article._id === articleID) {
            return {
              ...article,
              comments: [...article.commentsID, commentContent],
            };
          }
          return article;
        }),
      }));

      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleOptionsClick = (article) => {
    setEditArticle(article);
    setIsDialogOpen((prev) => !prev);
  };

  const handlePostDelete = async (postID) => {
    try {
      const deletedPostID = await deleteArticle(postID);

      setUserState((prev) => ({
        ...prev,
        articles: prev.articles.filter(
          (article) => article._id !== deletedPostID
        ),
      }));
    } catch (err) {
      console.log("Post Delete Error: ", err.message);
    }
  };

  const modifyArticlesFn = (allArticles) => {
    if (!allArticles) return [];

    return allArticles.map((article) => ({
      ...article,
      commentsDisplayed: false,
    }));
  };
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    async function fetchFollowerData() {
      const [followers, allArticles] = await Promise.all([
        getFollowers(followersList),
        getArticles(),
      ]);

      const modifiedArticles = modifyArticlesFn(allArticles);
      setUserState((prev) => ({
        ...prev,
        followersDetails: followers,
        articles: modifiedArticles,
      }));
    }

    fetchFollowerData();
  }, [followersList]);
  useEffect(() => {
    setIsLoading(true);
    async function fetchUserData() {
      try {
        const userInfo = await getUser();

        const [followers, allArticles] = await Promise.all([
          getFollowers(userInfo.following),
          getArticles(),
        ]);

        const modifiedArticles = modifyArticlesFn(allArticles);

        setUserState({
          userDetails: userInfo,
          followersDetails: followers,
          articles: modifiedArticles,
        });
      } catch (err) {
        console.log("User details error: ", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);
  return (
    <div
      className="home_container"
      style={isDialogOpen ? { padding: "0rem" } : { padding: "0.5rem" }}
    >
      {isDialogOpen && (
        <EditPost
          article={editArticle}
          setIsDialogOpen={setIsDialogOpen}
          setUserState={setUserState}
        />
      )}
      <div className="flex-col home_container-left" style={{ flex: 1 }}>
        <Status
          isLoading={isLoading}
          userDetails={userState.userDetails || []}
        />

        <AddFriend
          isLoading={isLoading}
          followersDetails={userState.followersDetails}
          setFollowersList={setFollowersList}
        />
      </div>
      <div className=" flex-col home_container-right">
        <div className="home_container-right-top">
          <NewPost setUserState={setUserState} />
          <Followers />
        </div>
        <div className="flex-col home_container-right-bottom">
          <div className="search-container">
            <input
              className="search-field"
              type="text"
              placeholder="search"
              data-testid="search_posts"
              value={searchPost}
              onChange={(e) => setSearchPost(e.target.value)}
            ></input>
          </div>
          <ShowPosts
            articles={userState.articles}
            handleOptionsClick={handleOptionsClick}
            handleCommentsClick={handleCommentsClick}
            handleAddComment={handleAddComment}
            comment={comment}
            setComment={setComment}
            handlePostDelete={handlePostDelete}
            userDetails={userState.userDetails}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
