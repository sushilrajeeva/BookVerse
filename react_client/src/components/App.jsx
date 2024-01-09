import React from "react";
import "./App.css";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./Home";
import Employees from "./Employees";
import Employers from "./Employers";
import Authors from "./Authors";
import Author from "./Author";
import Books from "./Books";
import Search from "./Search";
import Book from "./Book";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    // I modified professor's graphql rect lecture code to develop my lab 7 client component
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className='App-header'>
            <h1 className='App-title' >
              BookVerse
            </h1>
            <nav>
              <NavLink className='navlink' to='/'>
                Home
              </NavLink>
              <NavLink className='navlink' to='/books'>
                Books
              </NavLink>

              <NavLink className='navlink' to='/authors'>
                Authors
              </NavLink>

              <NavLink className='navlink' to='/search'>
                Search
              </NavLink>
              
            </nav>
          </header>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/search/' element={<Search />} />
            <Route path='/books/' element={<Books />} />
            <Route path='/Authors/' element={<Authors />} />
            
            
            <Route path='/authors/:id' element={<Author />} />
            <Route path='/books/:id' element={<Book />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
