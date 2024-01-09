import React, { useState } from 'react';
import './App.css';
import AddAuthorModal from './modals/AddAuthorModal';
import EditAuthorModal from './modals/EditAuthorModal';
import DeleteAuthorModal from './modals/DeleteAuthorModal';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link } from 'react-router-dom'; 

// referred this for circular loading ref -> https://mui.com/material-ui/react-progress/
import { CircularProgress } from '@mui/material';


function Authors() {
    console.log("Authors is called");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAuthor, setEditAuthor] = useState(null);
  const [deleteAuthor, setDeleteAuthor] = useState(null);
  const { loading, error, data } = useQuery(queries.GET_AUTHORS, {
    fetchPolicy: 'cache-and-network'
  });

  const handleOpenEditModal = (author) => {
    setShowEditModal(true);
    setEditAuthor(author);
  };

  const handleOpenDeleteModal = (author) => {
    setShowDeleteModal(true);
    setDeleteAuthor(author);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowAddModal(false);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }
  if (error) return <div>{error.message}</div>;
  
  const { authors } = data;

  return (
    
    <div style={{ padding: '20px' }}>
        {/* all the buttons design i have taken from material ui ref -> https://mui.com/material-ui/api/button/ */}
        {/* for material ui icons -> https://mui.com/material-ui/icons/ */}
      <Button variant="contained" color="primary" startIcon={<PersonAddIcon />} onClick={handleOpenAddModal}>
        Add Author
      </Button>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {authors.map((author) => (
          <Grid item xs={12} sm={6} md={4} key={author._id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2">
                  <Link to={`/authors/${author._id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                    {author.first_name} {author.last_name}
                  </Link>
                </Typography>
                <Typography color="textSecondary">
                  Number of Books: {author.numOfBooks}
                </Typography>
                <div style={{ marginTop: '10px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '10px' }}
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEditModal(author)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenDeleteModal(author)}
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
        <EditAuthorModal
          isOpen={showEditModal}
          author={editAuthor}
          handleClose={handleCloseModals}
        />
      )}

      {showAddModal && (
        <AddAuthorModal
          isOpen={showAddModal}
          handleClose={handleCloseModals}
        />
      )}

      {showDeleteModal && (
        <DeleteAuthorModal
          isOpen={showDeleteModal}
          author={deleteAuthor}
          handleClose={handleCloseModals}
        />
      )}
    </div>
  );

}





export default Authors;
