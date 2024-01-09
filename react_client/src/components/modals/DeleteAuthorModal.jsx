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

function DeleteAuthorModal(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
  const [author, setAuthor] = useState(props.author);
  const navigate = useNavigate();

  const [removeAuthor] = useMutation(queries.DELETE_AUTHOR, {
    variables: { id: props.author?._id },
    onCompleted: () => {
      // I am going to navigate to authors route after deletion
      navigate('/authors');
    },
    // for this i referred professor's lecture code
    update(cache, { data: { removeAuthor } }) {
      const { authors } = cache.readQuery({ query: queries.GET_AUTHORS });
      cache.writeQuery({
        query: queries.GET_AUTHORS,
        data: { authors: authors.filter((a) => a._id !== author._id) }
      });
    }
  });

  // this function will set the show delete modal to false and hence closing this model
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setAuthor(null);
    props.handleClose();
  };

  return (
    <div>
      <ReactModal
        isOpen={showDeleteModal}
        contentLabel='Delete Author'
        style={customStyles}
        onRequestClose={handleCloseDeleteModal}
      >
        {author && ( // Checking if author is not null before rendering the content, referred professor's lecture code
          <div style={{ padding: '20px' }}>
            <p style={{ marginBottom: '20px' }}>Are you sure you want to delete {author.first_name} {author.last_name}?</p>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <form
                    className='form'
                    onSubmit={(e) => {
                        e.preventDefault();
                        removeAuthor({
                        variables: {
                            id: author._id
                        }
                        });
                        setShowDeleteModal(false);
                        alert('Author Deleted');
                        props.handleClose();
                    }}
                >
              <button className='button add-button' type='submit'>
                Delete Author
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

export default DeleteAuthorModal;
