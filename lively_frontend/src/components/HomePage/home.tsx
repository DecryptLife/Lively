import { useEffect, useRef, useState } from "react";
import Status from "./status";
import "./home.css";
import ShowPosts from "./showPosts";
import NewPost from "./newPost";
import Followers from "./Followers";
import AddFriend from "./addFriend";
import { getFollowers } from "../../API/followersAPI";
import EditPost from "./EditPost";
import _, { initial } from "lodash";
import {
  getUser,
  getArticles,
  addComment,
  deleteArticle,
} from "../../API/homeAPI";

const Home = () => {
  console.log("Home rendered");
  const isInitialMount = useRef(true);
  const prevSearchKeyWord = useRef("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [comment, setComment] = useState("");
  const [followersList, setFollowersList] = useState<Array<string>>([]);
  const [editArticle, setEditArticle] = useState<IUpdateArticle>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [userState, setUserState] = useState<IUserState | null>({
    userDetails: null,
    followersDetails: [],
    articles: [],
  });

  const handleCommentsClick = (articleID: string) => {
    setUserState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        articles: prev.articles.map((article) => {
          if (article._id === articleID) {
            return {
              ...article,
              commentsDisplayed: !article?.commentsDisplayed,
            };
          }
          return article;
        }),
      };
    });
  };

  const handleAddComment = async (articleID: string, newComment: string) => {
    if (newComment === "" || !userState?.userDetails) return;

    const commentContent = {
      comment: newComment,
      author: userState?.userDetails?.username,
      author_image: userState?.userDetails?.avatar,
    };

    try {
      await addComment(articleID, commentContent);

      setUserState((prev) => {
        if (!prev) return prev;
        return {
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
        };
      });

      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleOptionsClick = (article: IArticle) => {
    setEditArticle(article);
    setIsDialogOpen((prev) => !prev);
  };

  const handlePostDelete = async (postID: string) => {
    try {
      const deletedPostID = await deleteArticle(postID);

      setUserState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          articles: prev.articles.filter(
            (article) => article._id !== deletedPostID
          ),
        };
      });
    } catch (err: unknown) {
      if (err instanceof Error) console.log("Post Delete Error: ", err.message);
    }
  };

  const modifyArticlesFn = (allArticles: Array<IArticle>) => {
    if (!allArticles) return [];

    return allArticles.map((article) => ({
      ...article,
      commentsDisplayed: false,
    }));
  };

  useEffect(() => {
    const debouncedSearch = _.debounce(async () => {
      if (searchKeyword !== "" || prevSearchKeyWord.current !== "") {
        try {
          const posts = await getArticles(searchKeyword);

          setUserState((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              articles: modifyArticlesFn(posts),
            };
          });
        } catch (err: unknown) {
          if (err instanceof Error)
            console.log(`Search Post Error: ${err.message}`);
        }
      }

      prevSearchKeyWord.current = searchKeyword;
    }, 500); // Wait 300ms after user stops typing

    debouncedSearch();

    return () => {
      debouncedSearch.cancel(); // Cancel debounce on component unmount or before the next effect is run
    };
  }, [searchKeyword]);
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
      setUserState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followersDetails: followers,
          articles: modifiedArticles,
        };
      });
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
      } catch (err: unknown) {
        if (err instanceof Error)
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
          userDetails={userState?.userDetails || []}
        />

        <AddFriend
          isLoading={isLoading}
          followersDetails={userState?.followersDetails}
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
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            ></input>
          </div>
          <ShowPosts
            articles={userState?.articles}
            handleOptionsClick={handleOptionsClick}
            handleCommentsClick={handleCommentsClick}
            handleAddComment={handleAddComment}
            comment={comment}
            setComment={setComment}
            handlePostDelete={handlePostDelete}
            userDetails={userState?.userDetails}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
