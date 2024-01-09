import React from "react";
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions 
} from "@mui/material";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth='lg'>
      <Box my={4} textAlign='center'>
        <Typography variant='h2' gutterBottom>
          Welcome to BookVerse
        </Typography>
        <Typography variant='h5' gutterBottom>
          Explore the World of Books and Authors with BookVerse powered by <strong>GrapQL</strong> and <strong>Redis</strong>
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>Discover Books in this BookVerse</Typography>
              <Typography>
                From fiction to non-fiction, explore books across a variety of genres. Find comprehensive details about each book.
              </Typography>
            </CardContent>
            <CardActions>
            
              <Button size="small">
                <Link to={`/books/`} style={{ textDecoration: 'none', color: 'blue' }}>
                  Learn More
                </Link>
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>Learn About Authors</Typography>
              <Typography>
                Get to know the minds behind the words. See a list of books written by each author and delve deeper into their literary world.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">
                <Link to={`/authors/`} style={{ textDecoration: 'none', color: 'blue' }}>
                  Learn More
                </Link>
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>Tailored Search Options</Typography>
              <Typography>
                Use our genre-based search to filter books, find books within your price range, and discover authors by searching for their name.
              </Typography>
            </CardContent>
            <CardActions>
            <Button size="small">
                <Link to={`/search/`} style={{ textDecoration: 'none', color: 'blue' }}>
                  Learn More
                </Link>
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      
    </Container>
  );
};

export default Home;
