import React, { useState } from 'react';
import './App.css';
//import AddBookModal from './modals/AddBookModal';
//import EditBookModal from './modals/EditBookModal';
//import DeleteBookModal from './modals/DeleteBookModal';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import { Card, CardContent, Typography, Button, Grid, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import AddBookModal from './modals/AddBookModal';
import EditBookModal from './modals/EditBookModal';
import DeleteBookModal from './modals/DeleteBookModal';

function Books() {
    console.log("Books is called");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);
  const { loading, error, data } = useQuery(queries.GET_BOOKS, {
    fetchPolicy: 'cache-and-network'
  });

  const handleOpenEditModal = (book) => {
    setShowEditModal(true);
    setEditBook(book);
  };

  const handleOpenDeleteModal = (book) => {
    setShowDeleteModal(true);
    setDeleteBook(book);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) return <div>
    {error.message}
    <div></div>
  </div>;

  
  console.log("Books", data);
const { books } = data;
  

  return (
     // I referred professor's lecture code for this
    // i also refered material ui - cards and form control for the design - > https://mui.com/material-ui/react-card/
    // used material ui buttons -> https://mui.com/material-ui/react-button/
    <div style={{ padding: '20px' }}>
        {console.log("books is called")}
        {/* all the buttons design i have taken from material ui ref -> https://mui.com/material-ui/api/button/ */}
        {/* for material ui icons -> https://mui.com/material-ui/icons/ */}
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setShowAddModal(true)}>
        Add Book
      </Button>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book._id}>
            <Card variant="outlined" style={{ minHeight: '350px' }}>
              <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="h2">
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
                            {book.author.first_name} {book.author.last_name}
                        </Link>
                
                    </Typography>
                 </div>
                
                <div>
                    <Typography component="span" style={{ fontWeight: 'bold' }}>
                        Publisher:
                    </Typography>
                    <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                        {book.publisher}
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
                {book.genres.length > 0 && (
                    <div>
                        <Typography component="span" style={{ fontWeight: 'bold' }}>
                            Genres:
                        </Typography>
                        <ul>
                        {book.genres.map(genre => (
                             <li key={genre}>
                                <Typography color="textSecondary">{genre}</Typography>
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
                <div style={{ marginTop: '10px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '10px' }}
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEditModal(book)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenDeleteModal(book)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {showEditModal && (
        <EditBookModal
          isOpen={showEditModal}
          book={editBook}
          handleClose={handleCloseModals}
        />
      )}

      {showAddModal && (
        <AddBookModal
          isOpen={showAddModal}
          handleClose={handleCloseModals}
        />
      )}

      {showDeleteModal && (
        <DeleteBookModal
          isOpen={showDeleteModal}
          book={deleteBook}
          handleClose={handleCloseModals}
        />
      )}
    </div>
  );
}

export default Books;
