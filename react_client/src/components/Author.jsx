import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Button,  CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

import EditAuthorModal from './modals/EditAuthorModal';
import DeleteAuthorModal from './modals/DeleteAuthorModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// using useNavigate to help me navigate to authors component / route as soon as the user deletes the author card
import { useNavigate } from 'react-router-dom';


function Author() {
    const { id } = useParams();
    const { loading, error, data } = useQuery(queries.GET_AUTHOR_BY_ID, {
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
  
    const author = data.getAuthorById;

    // to get only 3 books at max i will slice the books array
    const booksToShow = author.books.slice(0, 3);

    // writing the handling function that handles the modal for me
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
            {author.first_name} {author.last_name}
          </Typography>
          <div>
            <Typography component="span" style={{ fontWeight: 'bold' }}>
                Date of Birth:
            </Typography>
            <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
                {author.date_of_birth}
            </Typography>
        </div>
        <div>
          <Typography component="span" style={{ fontWeight: 'bold' }}>
            Hometown:
          </Typography>
          <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
            {author.hometownCity}, {author.hometownState}
          </Typography>
        </div>
        <div>
          <Typography component="span" style={{ fontWeight: 'bold' }}>
            Number of Books:
          </Typography>
          <Typography component="span" color="textSecondary" style={{ marginLeft: '5px' }}>
            {author.numOfBooks}
          </Typography>
        </div>
        {booksToShow.length > 0 && (
          <div>
            <Typography component="span" style={{ fontWeight: 'bold' }}>
              Books:
            </Typography>
            <ul>
              {booksToShow.map(book => (
                <li key={book._id}>
                    
                    <Typography color="textSecondary">
                        <Link to={`/books/${book._id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                            {book.title}
                        </Link>
                    </Typography>
                </li>
              ))}
            </ul>
          </div>
        )}
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
        <EditAuthorModal
          isOpen={showEditModal}
          author={author}
          handleClose={handleCloseModals}
        />
      )}

      {showDeleteModal && (
        <DeleteAuthorModal
          isOpen={showDeleteModal}
          author={author}
          handleClose={handleCloseModals}
        />
      )}
      </Card>
    );
  }
  
  export default Author;
  