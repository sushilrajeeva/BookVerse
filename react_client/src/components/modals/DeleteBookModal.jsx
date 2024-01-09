import React, { useState } from 'react';
import '../App.css';
import { useMutation } from '@apollo/client';
import ReactModal from 'react-modal';
import queries from '../../queries';
import { useNavigate } from 'react-router-dom';

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
      borderRadius: '4px'
    }
  };

function DeleteBookModal(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
  const [book, setBook] = useState(props.book);
  const navigate = useNavigate();

  const [removeBook] = useMutation(queries.DELETE_BOOK, {
    variables: { id: props.book?._id },
    onCompleted: () => {
      // I will navigate to books route after deletion takes place
      navigate('/books');
    },
    // for this i referred professor's lecture code
    update(cache, { data: { removeBook } }) {
      const { books } = cache.readQuery({ query: queries.GET_BOOKS });
      cache.writeQuery({
        query: queries.GET_BOOKS,
        data: { books: books.filter((b) => b._id !== book._id) }
      });
    }
  });

  // this function will set the show delete modal to false and hence closing this model
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBook(null);
    props.handleClose();
  };

  return (
    <div>
      <ReactModal
        isOpen={showDeleteModal}
        contentLabel='Delete Book'
        style={customStyles}
        onRequestClose={handleCloseDeleteModal}
      >
        {book && ( // Checking if book is not null before rendering the content, referred professor's lecture code
          <div style={{ padding: '20px' }}>
            <p style={{ marginBottom: '20px' }}>Are you sure you want to delete the book titled "{book.title}"?</p>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <form
                    className='form'
                    onSubmit={(e) => {
                        e.preventDefault();
                        removeBook({
                        variables: {
                            id: book._id
                        }
                        });
                        setShowDeleteModal(false);
                        alert('Book Deleted');
                        props.handleClose();
                    }}
                >
              <button className='button add-button' type='submit'>
                Delete Book
              </button>
            </form>
            </div>
          </div>
        )}
        <button
          className='button cancel-button'
          onClick={handleCloseDeleteModal}
        >
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default DeleteBookModal;
