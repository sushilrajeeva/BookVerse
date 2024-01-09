import React, { useState } from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import { useMutation } from '@apollo/client';
import queries from '../../queries';
import { Card, CardContent, TextField, Button, Box } from '@mui/material';

ReactModal.setAppElement('#root');
// this is same as professor's lecture code 
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      border: '1px solid #28547a',
      borderRadius: '4px',
      padding: '20px',
      overflow: 'auto'
    }
  };

function EditBookModal(props) {

    // initializing the states for this component
  const [showEditModal, setShowEditModal] = useState(props.isOpen);
  const [book, setBook] = useState(props.book);
  const [editBook] = useMutation(queries.EDIT_BOOK);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setBook(null);
    props.handleClose();
  };

  let title,
    publicationDate,
    publisher,
    summary,
    isbn,
    language,
    pageCount,
    price,
    authorId;

  return (
    // i also refered material ui - cards and form control for the design - > https://mui.com/material-ui/react-card/
    // used material ui buttons -> https://mui.com/material-ui/react-button/
    <div>
      <ReactModal
        isOpen={showEditModal}
        contentLabel='Edit Book'
        style={customStyles}
        onRequestClose={handleCloseEditModal}
      >
        <Card>
          <CardContent>
            <Box sx={{ 
              maxHeight: '70vh',
              overflowY: 'auto'
            }}>
            <form
              className='form'
              onSubmit={(e) => {
                e.preventDefault();
                console.log("checking isbn", isbn.value);
                editBook({
                  variables: {
                    id: book._id,
                    title: title.value,
                    genres: book.genres, // Keep the genres as they are
                    publicationDate: publicationDate.value,
                    publisher: publisher.value,
                    summary: summary.value,
                    isbn: isbn.value,
                    language: language.value,
                    pageCount: parseInt(pageCount.value, 10),
                    price: parseFloat(price.value),
                    format: book.format, // Keep the format as it is
                    authorId: authorId.value,
                  },
                });
                handleCloseEditModal();
                alert('Book Updated');
              }}
            >
              <TextField
                label='Title'
                defaultValue={book.title}
                inputRef={(node) => {
                  title = node;
                }}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Publication Date in (D/M/YYYY or DD/MM/YYYY Format only)'
                defaultValue={book.publicationDate}
                inputRef={(node) => {
                  publicationDate = node;
                }}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Publisher'
                defaultValue={book.publisher}
                inputRef={(node) => {
                  publisher = node;
                }}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Summary'
                defaultValue={book.summary}
                inputRef={(node) => {
                  summary = node;
                }}
                fullWidth
                margin='normal'
                multiline
                rows={4}
              />
              <TextField
                label='ISBN'
                defaultValue={book.isbn}
                inputRef={(node) => {
                  isbn = node;
                }}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Language'
                defaultValue={book.language}
                inputRef={(node) => {
                  language = node;
                }}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Page Count'
                defaultValue={book.pageCount}
                inputRef={(node) => {
                  pageCount = node;
                }}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Price'
                defaultValue={book.price}
                inputRef={(node) => {
                  price = node;
                }}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Author ID'
                defaultValue={book.author._id}
                inputRef={(node) => {
                  authorId = node;
                }}
                fullWidth
                margin='normal'
              />
              <div
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  style={{ marginRight: '10px' }}
                >
                  Update Book
                </Button>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </Button>
              </div>
            </form>
            </Box>
          </CardContent>
        </Card>
      </ReactModal>
    </div>
  );
}

export default EditBookModal;
