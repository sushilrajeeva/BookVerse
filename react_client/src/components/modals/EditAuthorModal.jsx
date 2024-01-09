import React, { useState } from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import { useMutation } from '@apollo/client';
import queries from '../../queries';
import { Card, CardContent, TextField, Button } from '@mui/material';

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

function EditAuthorModal(props) {
    // initializing the states for this component
  const [showEditModal, setShowEditModal] = useState(props.isOpen);
  const [author, setAuthor] = useState(props.author);
  const [editAuthor] = useMutation(queries.EDIT_AUTHOR);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setAuthor(null);
    props.handleClose();
  };

  let firstName, lastName, dateOfBirth, hometownCity, hometownState;

  return (
    // i also refered material ui - cards and form control for the design - > https://mui.com/material-ui/react-card/
    // used material ui buttons -> https://mui.com/material-ui/react-button/
    <div>
        {/* Took all the code from professor's lecture code, and modified the content to use card from material ui */}
        
      <ReactModal
        isOpen={showEditModal}
        contentLabel='Edit Author'
        style={customStyles}
        onRequestClose={handleCloseEditModal}
      >
        <Card>
          <CardContent>
            <form
              className='form'
              onSubmit={(e) => {
                e.preventDefault();
                editAuthor({
                  variables: {
                    id: author._id,
                    firstName: firstName.value,
                    lastName: lastName.value,
                    dateOfBirth: dateOfBirth.value,
                    hometownCity: hometownCity.value,
                    hometownState: hometownState.value
                  }
                });
                handleCloseEditModal();
                alert('Author Updated');
              }}
            >
              <TextField
                label="First Name"
                defaultValue={author.first_name}
                inputRef={(node) => { firstName = node; }}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                defaultValue={author.last_name}
                inputRef={(node) => { lastName = node; }}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date of Birth"
                defaultValue={author.date_of_birth}
                inputRef={(node) => { dateOfBirth = node; }}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Hometown City"
                defaultValue={author.hometownCity}
                inputRef={(node) => { hometownCity = node; }}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Hometown State"
                defaultValue={author.hometownState}
                inputRef={(node) => { hometownState = node; }}
                fullWidth
                margin="normal"
              />
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginRight: '10px' }}
                >
                  Update Author
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </ReactModal>
    </div>
  );
}

export default EditAuthorModal;

