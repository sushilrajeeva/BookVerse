// For this i referred professor's lecture code and also modified his code a bit to integerate Material UI CARDS
// reference -> https://mui.com/material-ui/api/button/ for button
// https://mui.com/material-ui/react-card/ for cards
// https://mui.com/material-ui/api/form-control/ for form control 

import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useMutation } from '@apollo/client';
import queries from '../../queries';
import { Card, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Box, Checkbox, ListItemText } from '@mui/material';

ReactModal.setAppElement('#root');

// this is same as professor's lecture code 
// just modified a bit to enable scorable functino as my add modal was over flowing
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      maxHeight: '90vh',  
      border: '1px solid #28547a',
      borderRadius: '4px',
      padding: '20px',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  };
  

function AddBookModal(props) {

    // initializing all the useStates 
  const [title, setTitle] = useState('');
  const [genres, setGenres] = useState([])
  const [publicationDate, setPublicationDate] = useState('');
  const [publisher, setPublisher] = useState('');
  const [summary, setSummary] = useState('');
  const [isbn, setIsbn] = useState('');
  const [language, setLanguage] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [price, setPrice] = useState('');
  const [format, setFormat] = useState([]);
  const [authorId, setAuthorId] = useState('');

  // referred professor's code for add employee and wrote a similar version
  const [addBook] = useMutation(queries.ADD_BOOK, {
    update(cache, { data: { addBook } }) {
      const { books } = cache.readQuery({ query: queries.GET_BOOKS });
      cache.writeQuery({
        query: queries.GET_BOOKS,
        data: { books: books.concat([addBook]) }
      });
    }
  });

  // i am writing this funciton to take care of the genre change as user selects or changes the genre in the form
  const handleGenresChange = (event) => {
    const {
      target: { value },
    } = event;
    setGenres(typeof value === 'string' ? value.split(',') : value);
  };

  // i am writing this funciton to take care of the format change as user selects or changes the format in the form
  const handleFormatChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormat(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("title", title);
    console.log("Page count", pageCount);
    console.log("Price", price);
    addBook({ variables: { title, genres, publicationDate, publisher, summary, isbn, language, pageCount: parseInt(pageCount), price: parseFloat(price), format, authorId } });
    // Resetting fields after submission
    setTitle('');
    setGenres(['']);
    setPublicationDate('');
    setPublisher('');
    setSummary('');
    setIsbn('');
    setLanguage('');
    setPageCount('');
    setPrice('');
    setFormat(['']);
    setAuthorId('');
    props.handleClose();
  };

  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={props.handleClose}
      style={customStyles}
      contentLabel="Add Book"
    >
      <Card>
        <CardContent>

            {/* i had issues with overflow of y axis content of this card so i kept it in material ui box and added overflowY auto to fix it
            i referred -> https://mui.com/system/display/ to do this */}
          <Box sx={{ 
              maxHeight: '70vh',
              overflowY: 'auto'
            }}>
            <form className="form" onSubmit={handleSubmit}>

            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                autoFocus
                required
            />

            <TextField
                label="Publication Date in (D/M/YYYY or DD/MM/YYYY Format only)"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />

            <TextField
                label="Publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />
            <TextField
                label="Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                required
            />

            <TextField
                label="ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />
                    
            <TextField
                label="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />

            <TextField
                label="Page Count"
                value={pageCount}
                onChange={(e) => setPageCount(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />

            <TextField
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />

            <TextField
                label="Author ID"
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />
            
            
                {/* I referred -> https://mui.com/material-ui/api/select/ for the select form control 
                also referred -> https://stackoverflow.com/questions/73998290/material-ui-how-to-rendervalue-display-label-of-select-tag to make sure the selected options are shown to user */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="genres-label">Genres</InputLabel>
                <Select
                    labelId="genres-label"
                    multiple
                    value={genres}
                    onChange={handleGenresChange}
                    input={<OutlinedInput label="Genres" />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {/* I got all of these geners from google search */}
                    {['Fiction', 'Mystery', 'Science Fiction', 'Historical Fiction', 'Non-Fiction', 'Fantasy', 'Thriller', 'Horror', 'Romance', 'Literary Fiction', 'Short Story', 'Biography', 'Literature', 'Graphic Novel', 'Young Adult', 'Poetry', 'Memoir', 'Autobiography', 'Adventure Fiction', 'Fairy Tale', 'Horror Fiction', 'Fable', 'Legend', 'Dystopia'].map((genre) => (
                        <MenuItem key={genre} value={genre}>
                            <Checkbox checked={genres.indexOf(genre) > -1} />
                            <ListItemText primary={genre} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="format-label">Format</InputLabel>
              <Select
                labelId="format-label"
                multiple
                value={format}
                onChange={handleFormatChange}
                input={<OutlinedInput label="Format" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {/* got all the different format of books by google search */}
                {['Paperback', 'Hardcover', 'PDF', 'Audiobook', 'EPUB', 'Kindle File Format', 'Ebook', 'Fiction Book', 'Quarto', 'Folio', 'Standard Manuscript Format', 'Photo-book', 'Mass market paperbacks'].map((item) => (
                  <MenuItem key={item} value={item}>
                    <Checkbox checked={format.indexOf(item) > -1} />
                    <ListItemText primary={item} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginRight: '10px' }}
              >
                Add Book
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
          </Box>
        </CardContent>
      </Card>
    </ReactModal>
  );
}

export default AddBookModal;
