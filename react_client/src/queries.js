import { gql } from "@apollo/client";

const GET_EMPLOYEES = gql`
  query {
    employees {
      _id
      firstName
      lastName
      employer {
        name
        _id
      }
    }
  }
`;

// Writing logic to get authors
const GET_AUTHORS = gql`
  query {
    authors {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
      numOfBooks
    }
  }
`;

// Writing logic to get books
const GET_BOOKS = gql`
  query {
    books {
      _id
      title
      summary
      publisher
      publicationDate
      price
      pageCount
      language
      isbn
      genres
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;

const GET_EMPLOYERS = gql`
  query {
    employers {
      name
      _id
    }
  }
`;

const GET_EMPLOYERS_WITH_EMPLOYEES = gql`
  query {
    employers {
      _id
      name
      numOfEmployees
      employees {
        _id
        firstName
        lastName
      }
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation createEmployee(
    $firstName: String!
    $lastName: String!
    $employerId: Int!
  ) {
    addEmployee(
      firstName: $firstName
      lastName: $lastName
      employerId: $employerId
    ) {
      _id
      firstName
      lastName
      employer {
        name
        _id
      }
    }
  }
`;

// I modified professor's code and refered his ADD_EMPLOYEE
const ADD_AUTHOR = gql`
  mutation AddAuthor(
    $firstName: String!
    $lastName: String!
    $dateOfBirth: String!
    $hometownCity: String!
    $hometownState: String!
  ) {
    addAuthor(
      first_name: $firstName
      last_name: $lastName
      date_of_birth: $dateOfBirth
      hometownCity: $hometownCity
      hometownState: $hometownState
    ) {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
    }
  }
`;

// I modified my above ADD_Author code and also referred professor's lectore code to create ADD_BOOK
const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $genres: [String!]!
    $publicationDate: String!
    $publisher: String!
    $summary: String!
    $isbn: String!
    $language: String!
    $pageCount: Int!
    $price: Float!
    $format: [String!]!
    $authorId: String!
  ) {
    addBook(
      title: $title
      genres: $genres
      publicationDate: $publicationDate
      publisher: $publisher
      summary: $summary
      isbn: $isbn
      language: $language
      pageCount: $pageCount
      price: $price
      format: $format
      authorId: $authorId
    ) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;

const ADD_EMPLOYER = gql`
  mutation createEmployer($name: String!) {
    addEmployer(name: $name) {
      _id
      name
      numOfEmployees
      employees {
        firstName
        lastName
        _id
      }
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: String!) {
    removeEmployee(_id: $id) {
      _id
      firstName
      lastName
      employer {
        name
        _id
      }
    }
  }
`;

// Used professor's lecture code for DELETE_EMPLOYEE to create my dete function for author
const DELETE_AUTHOR = gql`
  mutation RemoveAuthor($id: String!) {
    removeAuthor(_id: $id) {
      _id
    }
  }
`;

// Used professor's lecture code for DELETE_EMPLOYEE to create my dete function for book
const DELETE_BOOK = gql`
  mutation RemoveBook($id: String!) {
    removeBook(_id: $id) {
      _id
    }
  }
`;

const EDIT_EMPLOYEE = gql`
  mutation changeEmployee(
    $id: String!
    $firstName: String
    $lastName: String
    $employerId: Int
  ) {
    editEmployee(
      _id: $id
      employerId: $employerId
      firstName: $firstName
      lastName: $lastName
    ) {
      _id
      firstName
      lastName
      employer {
        _id
        name
      }
    }
  }
`;

// Used professor's lecture code for Edit employee and modified it to create my Edit author fuction
const EDIT_AUTHOR = gql`
  mutation EditAuthor(
    $id: String!
    $firstName: String
    $lastName: String
    $dateOfBirth: String
    $hometownCity: String
    $hometownState: String
  ) {
    editAuthor(
      _id: $id
      first_name: $firstName
      last_name: $lastName
      date_of_birth: $dateOfBirth
      hometownCity: $hometownCity
      hometownState: $hometownState
    ) {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
    }
  }
`;

// Used professor's lecture code for Edit employee and modified it to create my Edit author fuction

const EDIT_BOOK = gql`
  mutation EditBook(
    $id: String!
    $title: String
    $genres: [String]
    $publicationDate: String
    $publisher: String
    $summary: String
    $isbn: String
    $language: String
    $pageCount: Int
    $price: Float
    $format: [String]
  ) {
    editBook(
      _id: $id
      title: $title
      genres: $genres
      publicationDate: $publicationDate
      publisher: $publisher
      summary: $summary
      isbn: $isbn
      language: $language
      pageCount: $pageCount
      price: $price
      format: $format
    ) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;

// referred professor's lecture code and refered his code on GET_EMPLOYEE_BY_ID to implement this
const GET_AUTHOR_BY_ID = gql`
  query GetAuthorById($id: String!) {
    getAuthorById(_id: $id) {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
      numOfBooks
      books {
        _id
        title
      }
    }
  }
`;

// referred professor's lecture code and refered his code on GET_EMPLOYEE_BY_ID to implement this
const GET_BOOK_BY_ID = gql`
  query GetBookById($id: String!) {
    getBookById(_id: $id) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;

// I used the apolo client to do this function and then just copied the code to react gql version
// after repeatedly doing the same steps over and over i found the hang of it
const SEARCH_AUTHORS_BY_NAME = gql`
  query SearchAuthorsByName($searchTerm: String!) {
    searchAuthorsByName(searchTerm: $searchTerm) {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
      numOfBooks
      books {
        title
        _id
      }
    }
  }
`;

const BOOKS_BY_PRICE_RANGE = gql`
  query BooksByPriceRange($min: Float!, $max: Float!) {
    booksByPriceRange(min: $min, max: $max) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;

const BOOKS_BY_GENRE = gql`
  query BooksByGenre($genre: String!) {
    booksByGenre(genre: $genre) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;

let exported = {
  ADD_EMPLOYEE,
  GET_EMPLOYEES,
  GET_EMPLOYERS,
  DELETE_EMPLOYEE,
  GET_EMPLOYERS_WITH_EMPLOYEES,
  ADD_EMPLOYER,
  EDIT_EMPLOYEE,
  GET_AUTHORS,
  EDIT_AUTHOR,
  DELETE_AUTHOR,
  ADD_AUTHOR,
  GET_AUTHOR_BY_ID,
  GET_BOOKS,
  ADD_BOOK,
  DELETE_BOOK,
  EDIT_BOOK,
  SEARCH_AUTHORS_BY_NAME,
  BOOKS_BY_PRICE_RANGE,
  BOOKS_BY_GENRE,
  GET_BOOK_BY_ID,
};

export default exported;
