import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axiosWithAuth from "../axios/index";
import axios from "axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const initialFormValues = { title: "", text: "", topic: "" };
  const [inititalValues, setValues] = useState(initialFormValues);

  const [currentArticle, setCurrentArticle] = useState();

  useEffect(() => {
    console.log("current article id use effect", currentArticleId);
    setCurrentArticle(
      articles.find((art) => art.article_id === currentArticleId)
    );
  }, [currentArticleId]);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    /* ✨ implement */
    navigate("/");
  };
  const redirectToArticles = () => {
    /* ✨ implement */
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.

    localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    {
      axios
        .post(loginUrl, {
          username: username.trim(),
          password: password.trim(),
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          setMessage(res.data.message);
          setSpinnerOn(false);
          redirectToArticles();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!

    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        setArticles(res.data.articles);
        console.log("fetching articles!", res.data);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
        redirectToLogin();
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.

    setMessage("");
    setSpinnerOn(true);
    // axiosWithAuth()
    //   .post("/articles", {
    //     title: article.title.trim(),
    //     text: article.text.trim(),
    //     topic: article.topic.trim(),
    //   })
    //   .then((res) => {
    //     // console.log(res.data);
    //     setArticles([...articles, res.data.article]);
    //     setMessage(res.data.message);
    //     setSpinnerOn(false);
    //   })
    //   .catch((err) => console.log(err));

    axiosWithAuth()
      .post("/articles", article)
      .then((res) => {
        console.log("article posted!", res.data.article);
        setSpinnerOn(false);
        setArticles([...articles, res.data.article]);
        setMessage(res.data.message);
      })
      .catch((err) => console.log(err));
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    console.log("updatearticle", article_id, article);
    setMessage("");
    axiosWithAuth()
      .put(`/articles/${article_id}`, article)
      .then((res) => {
        console.log("updating article!", res.data);
        setArticles(
          articles.map((element) => {
            if (element.article_id === article_id) {
              return res.data.article;
            }
            return element;
          })
        );
        setMessage(res.data.message);
        setValues(initialFormValues);
      })
      .catch((err) => console.log(err));
  };

  const deleteArticle = (article_id) => {
    // ✨ implement

    axiosWithAuth()
      .delete(`/articles/${article_id}`)
      .then((res) => {
        console.log("article deleted!", res.data);
        setMessage(res.data.message);
        setArticles(articles.filter((art) => art.article_id !== article_id));
      })
      .catch((err) => console.log(err));
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  updateArticle={updateArticle}
                  currentArticle={currentArticle}
                />
                <Articles
                  articles={articles}
                  currentArticleId={currentArticleId}
                  getArticles={getArticles}
                  setCurrentArticleId={setCurrentArticleId}
                  deleteArticle={deleteArticle}
                  updateArticle={updateArticle}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
