import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

import EditBookModal from './modals/EditBookModal';
import DeleteBookModal from './modals/DeleteBookModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Book() {
    const { id } = useParams();
    const { loading, error, data } = useQuery(queries.GET_BOOK_BY_ID, {
      variables: { id },
      fetchPolicy: 'cache-and-network'
    });

      // I am initializing my state for my modals
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      );
    }

    if (error) return <div>{error.message}</div>;

    const book = data.getBookById;

    const handleOpenEditModal = () => {
        setShowEditModal(true);
    };

    const handleOpenDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    return (
         // I referred professor's lecture code for this
    // i also refered material ui - cards and form control for the design - > https://mui.com/material-ui/react-card/
    // used material ui buttons -> https://mui.com/material-ui/react-button/
      <Card style={{ maxWidth: 600, margin: '20px auto' }}>
        <CardContent>
          <Typography variant="h4" component="h2">
            {book.title}
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
          <div>
            <Typography component="span" style={{ fontWeight: 'bold' }}>
                Publication Date:
            </Typography>
            <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                {book.publicationDate}
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
                Summary:
            </Typography>
            <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                {book.summary}
            </Typography>
          </div>
          <div>
            <Typography component="span" style={{ fontWeight: 'bold' }}>
                ISBN:
            </Typography>
            <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                {book.isbn}
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
                Language:
            </Typography>
            <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                {book.language}
            </Typography>
          </div>
          <div>
            <Typography component="span" style={{ fontWeight: 'bold' }}>
                Page Count:
            </Typography>
            <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                {book.pageCount}
            </Typography>
          </div>
          <div>
            <Typography component="span" style={{ fontWeight: 'bold' }}>
                Format:
            </Typography>
            <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                {book.format.join(", ")}
            </Typography>
          </div>
          
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleOpenEditModal}
              style={{ marginRight: '10px' }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleOpenDeleteModal}
            >
              Delete
            </Button>
          </div>
        </CardContent>

        {showEditModal && (
          <EditBookModal
            isOpen={showEditModal}
            book={book}
            handleClose={handleCloseModals}
          />
        )}

        {showDeleteModal && (
          <DeleteBookModal
            isOpen={showDeleteModal}
            book={book}
            handleClose={handleCloseModals}
          />
        )}
      </Card>
    );
}

export default Book;
