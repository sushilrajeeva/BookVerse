import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, CardActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, CircularProgress } from "@mui/material";
import queries from "../queries";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBookTerm, setSearchBookTerm] = useState("");
  const [searchType, setSearchType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [executeSearch, { loading, data }] = useLazyQuery(
    searchType === "authorsByName"
      ? queries.SEARCH_AUTHORS_BY_NAME
      : searchType === "booksByGenre"
      ? queries.BOOKS_BY_GENRE
      : queries.BOOKS_BY_PRICE_RANGE,
    {
      variables: {
        searchTerm: searchType === "authorsByName" ? searchTerm : undefined,
        genre: searchType === "booksByGenre" ? searchBookTerm : undefined,
        min:
          searchType === "booksByPriceRange"
            ? parseFloat(minPrice) || 0
            : undefined,
        max:
          searchType === "booksByPriceRange"
            ? parseFloat(maxPrice) || 999999
            : undefined,
      },
    }
  );


  const handleSearch = () => {
    
    executeSearch();
  };

  // This Function will render search results based on the search type
  const renderSearchResults = () => {

    // Function to render authors search results
    const renderAuthors = () => (
    // i also refered material ui - cards and form control for the design - > https://mui.com/material-ui/react-card/
    // used material ui buttons -> https://mui.com/material-ui/react-button/
        
        data?.searchAuthorsByName.map((author) => (
          <Grid item key={author._id} xs={12} sm={6} md={4} lg={3}>
            <Card elevation={3} style={{ padding: "16px" }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                <Button size="large" color="primary" component={Link} to={`/authors/${author._id}`}>
                {`${author.first_name} ${author.last_name}`}
                </Button>
                  
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Date of Birth: {author.date_of_birth}
                  <br />
                  Hometown: {`${author.hometownCity}, ${author.hometownState}`}
                  <br />
                  Number of Books: {author.numOfBooks}
                </Typography>
                <div style={{ marginTop: "10px" }}>
                  <strong>Books:</strong>
                  <ul>
                    {author.books.map((book, index) => (
                      <li key={book._id}>
                        <Link to={`/books/${book._id}`}>
                          {`${index + 1}. ${book.title}`}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardActions>
                
              </CardActions>
            </Card>
          </Grid>
        ))
      );

      // Function to render books search results
    const renderBooks = (books) => (
        books.map((book) => (
          <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
            <Card elevation={3} style={{ padding: "16px" }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    <Link to={`/books/${book._id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                        {book.title}
                    </Link>
                </Typography>
                <div>
                    <Typography component="span" style={{ fontWeight: 'bold' }}>
                        Author: 
                    </Typography>
                    <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                        <Link to={`/authors/${book.author._id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                            {`${book.author.first_name} ${book.author.last_name}`}
                        </Link>
                    </Typography>
                </div>
                <div>
                    <Typography component="span" style={{ fontWeight: 'bold' }}>
                        Genres:
                    </Typography>
                    <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                        {book.genres.join(", ")}
                    </Typography>
                </div>
                <div>
                    <Typography component="span" style={{ fontWeight: 'bold' }}>
                        Price:
                    </Typography>
                    <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                        {book.price}
                    </Typography>
                </div>
                
              </CardContent>
              <CardActions>
                
              </CardActions>
            </Card>
          </Grid>
        ))
      );

      // using these if else conditions to conditionally rendering the component we want
      if (searchType === "authorsByName") {
        return <Grid container spacing={2}>{renderAuthors()}</Grid>;
      } else if (searchType === "booksByGenre") {
        return <Grid container spacing={2}>{renderBooks(data?.booksByGenre)}</Grid>;
      } else if (searchType === "booksByPriceRange") {
        return <Grid container spacing={2}>{renderBooks(data?.booksByPriceRange)}</Grid>;
      }
      return null;
  };

  return (
    <Box sx={{ margin: '20px' }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="search-type-label">Select Search Type</InputLabel>
        <Select
          labelId="search-type-label"
          value={searchType}
          label="Select Search Type"
          onChange={(e) => setSearchType(e.target.value)}
        >
          <MenuItem value="">Select Search Type</MenuItem>
          <MenuItem value="authorsByName">Search Authors by Name</MenuItem>
          <MenuItem value="booksByGenre">Search Books by Genre</MenuItem>
          <MenuItem value="booksByPriceRange">Search Books by Price Range</MenuItem>
        </Select>
      </FormControl>

      {searchType === "booksByPriceRange" && (
        <Box display="flex" gap={2}>
          <TextField
            label="Min Price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Max Price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            fullWidth
          />
        </Box>
      )}

      {(searchType === "authorsByName" || searchType === "booksByGenre") && (
        <TextField
          label="Search Term"
          type="text"
          value={searchType === "authorsByName" ? searchTerm : searchBookTerm}
          onChange={(e) => searchType === "authorsByName" ? setSearchTerm(e.target.value) : setSearchBookTerm(e.target.value)}
          fullWidth
          margin="normal"
        />
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginTop: '20px' }}
      >
        Search
      </Button>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>}

      {data && <div>{renderSearchResults()}</div>}
    </Box>
  );
};

export default SearchComponent;