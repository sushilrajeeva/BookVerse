//Create the type definitions for the query and our data

export const typeDefs = `#graphql
  type Query {
    #1. For getting authors
    authors: [Author]
    #2. For getting Books
    books: [Book]
    #3. To get author by id
    getAuthorById(_id: String!): Author
    #4. To get book by id
    getBookById(_id: String!): Book
    #5. returns all the books that match the genre supplied
    booksByGenre (genre: String!): [Book]
    #6. returns all the books within a min/max price range (inclusive of the min/max value)
    booksByPriceRange (min: Float!, max: Float!) : [Book]
    #7. return an array of authors whose first and last name contains the searchTerm provided
    searchAuthorsByName (searchTerm: String!): [Author]
  }

  type Book {
    _id: String,
    title: String,
    genres: [String],
    publicationDate: String,
    publisher: String,
    summary: String,
    isbn: String,
    language: String,
    pageCount: Int,
    price: Float,
    format: [String],
    author: Author #We will need a resolver for this one!
  }

  type Author {
    _id: String,
    first_name: String,
    last_name: String,
    date_of_birth: String,
    hometownCity: String,
    hometownState: String,
    numOfBooks: Int #We will need a resolver for this one! This is a computed field that will count the number of books the author has written (see lecture code for numOfEmployees on the employer type)
    books(limit: Int): [Book]  #We will need a resolver for this one! the limit param is optional, if it's supplied, you will limit the results to the number supplied, if no limit parameter is supplied, then you return all the books for that author
  }


  type Mutation {
    addAuthor(
      first_name: String!, 
      last_name: String!,
      date_of_birth: String!, 
      hometownCity: String!, 
      hometownState: String!
      ): Author
    editAuthor(_id: String!, first_name: String, last_name: String, date_of_birth: String, hometownCity: String, hometownState: String): Author
    removeAuthor(_id: String!): Author
    addBook(title: String!, genres: [String!]!, publicationDate: String!, publisher: String!, summary: String!, isbn: String!, language: String!, pageCount: Int!, price: Float!, format: [String!]!, authorId: String!): Book
    editBook(_id: String!, title: String, genres: [String], publicationDate: String, publisher: String, summary: String, isbn: String, language: String, pageCount: Int, price: Float, format: [String], authorId: String): Book
    removeBook(_id: String!): Book
    # removeEmployee(_id: String!): Employee
    # editEmployee(
    #   _id: String!
    #   firstName: String
    #   lastName: String
    #   employerId: Int
    # ): Employee
    # addEmployer(name: String!): Employer
  }
`;
