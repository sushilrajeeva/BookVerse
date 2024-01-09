import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useMutation } from '@apollo/client';
import queries from '../../queries';
import { Card, CardContent, TextField, Button } from '@mui/material';

ReactModal.setAppElement('#root');
// this is same as professor's lecture code on Add Modal.js
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

function AddAuthorModal(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [hometownCity, setHometownCity] = useState('');
  const [hometownState, setHometownState] = useState('');

  // referred professor's code for add employee and wrote a similar version
  const [addAuthor] = useMutation(queries.ADD_AUTHOR, {
    update(cache, { data: { addAuthor } }) {
      const { authors } = cache.readQuery({ query: queries.GET_AUTHORS });
      cache.writeQuery({
        query: queries.GET_AUTHORS,
        data: { authors: authors.concat([addAuthor]) }
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAuthor({ variables: { firstName, lastName, dateOfBirth, hometownCity, hometownState } });
    // Resetting fields after submission
    setFirstName('');
    setLastName('');
    setDateOfBirth('');
    setHometownCity('');
    setHometownState('')
    props.handleClose();
  };

  return (
    // I referred professor's lecture code for this
    // i also refered material ui - cards and form control for the design - > https://mui.com/material-ui/react-card/
    // used material ui buttons -> https://mui.com/material-ui/react-button/
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={props.handleClose}
      style={customStyles}
      contentLabel="Add Author"
    >
      <Card>
        <CardContent>
          <form className="form" onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoFocus
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Date of Birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Hometown City"
              value={hometownCity}
              onChange={(e) => setHometownCity(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Hometown State"
              value={hometownState}
              onChange={(e) => setHometownState(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginRight: '10px' }}
              >
                Add Author
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={props.handleClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ReactModal>
  );
}

export default AddAuthorModal;
