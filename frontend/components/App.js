import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axiosWithAuth from "../axios/index";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    /* ✨ implement */
    navigate("/login/");
  };
  const redirectToArticles = () => {
    /* ✨ implement */
    navigate("/articles/");
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
        .post("http://localhost:9000/api/login", {
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

    /*

    - `[GET] http://localhost:9000/api/articles`
  - Expects an `Authorization` request header containing a valid auth token
  - The response to a proper request includes `200 OK` and a list of articles which could be empty
  */

    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth
      .get("http://localhost:9000/api/articles", articles)
      .then((res) => {
        setArticles(res.data);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        if (err === "401") {
          redirectToLogin;
        } else {
          setSpinnerOn(false);
        }
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    /*
- `[POST] http://localhost:9000/api/articles`
  - Expects an `Authorization` request header containing a valid auth token
  - Expects a payload with the following properties: `title`, `text`, `topic`
  - The `title` and `text` length must be >= 1, after trimming
  - The `topic` needs to be one of three values: `React`, `JavaScript`, `Node`
  - Example of payload: `{ "title": "foo", "text": "bar", "topic": "React" }`
  - The response to a proper request includes `201 Created`, a success message and the new article
    */

    axios
      .post("http://localhost:9000/api/articles", article, {
        title: title.trim(),
        text: text.trim(),
        topic: topic.trim(),
      })
      .then((res) => {
        setArticles(res.data);
      })
      .catch((err) => console.log(err));
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    /*
    - `[PUT] http://localhost:9000/api/articles/:article_id`
  - Expects an `Authorization` request header containing a valid auth token
  - Expects a payload with the following properties: `title`, `text`, `topic`
  - The `title` and `text` length must be >= 1, after trimming
  - The `topic` needs to be one of three values: `React`, `JavaScript`, `Node`
  - Example of payload: `{ "title": "foo", "text": "bar", "topic": "React" }`
  - The response to a proper request includes `200 OK`, a success message and the updated article
  */

    axiosWithAuth()
      .put(`http://localhost:9000/api/articles/${article_id}`, article, {
        title: title.trim(),
        text: text.trim(),
        topic: topic.trim(),
      })
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => console.log(err));
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    /*
    - `[DELETE] http://localhost:9000/api/articles/:article_id`
  - Expects an `Authorization` request header containing a valid auth token
  - The response to a proper request includes `200 OK` and a success message
  */
    axiosWithAuth()
      .delete(`http://localhost:9000/api/articles/${article_id}`, {
        title: title.trim(),
        text: text.trim(),
        topic: topic.trim(),
      })
      .then((res) => {
        deleteArticle(id);
        navigate("/articles/");
      })
      .catch((err) => console.log(err));
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner />
      <Message />
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
          <Route path="/" element={<LoginForm />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm />
                <Articles />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
