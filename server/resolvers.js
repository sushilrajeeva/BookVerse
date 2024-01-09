import { GraphQLError } from "graphql";

import redis from "redis";
import axios from "axios";
import md5 from "blueimp-md5";
import helpers from "./helpers.js";

import {
  authors as authorCollection,
  books as bookCollection,
} from "./config/mongoCollections.js";

import { v4 as uuid } from "uuid"; //for generating _id's

const client = redis.createClient();
client.connect().then(() => {});

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

export const resolvers = {
  Query: {
    authors: async () => {
      //from professor's lab 2 lecture code
      // checking if authors data is stored in Redis cache or not
      const exists = await client.exists("authors");

      if (exists) {
        //if we do have it in cache, send data from cache
        console.log("cache Hit!! Show authors from cache");
        let authors = await client.get("authors");
        console.log("Sending data from Redis....");
        return JSON.parse(authors);
      }

      //If authors data is not cached then we load the authors data from our database (authors collection)

      const authors = await authorCollection();
      const allAuthors = await authors.find({}).toArray();
      if (!allAuthors) {
        //Could not get list
        throw new GraphQLError(`Internal Server Error`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      // since aurthor was not in redis and we loaded it from db, now we will store the authors in Redis cache
      // Setting an expiration of 1 hour (1 hr = 60 min * 60 seconds = 3600 seconds) as mentioned in lab 3 ruberics
      client.set("authors", JSON.stringify(allAuthors));
      //Got this from reference -> https://dzone.com/articles/tutorial-working-nodejs-and under expire section
      //Was not able to directly set an expiery using client.set so had to find this client.expire solution from google
      client.expire("authors", 3600);

      return allAuthors;
    },

    books: async () => {
      //from professor's lab 2 lecture code
      // checking if books data is stored in Redis cache or not
      const exists = await client.exists("books");

      if (exists) {
        //if we do have books data in cache, send data from cache
        console.log("cache Hit!! Show books from cache");
        let books = await client.get("books");
        console.log("Sending data from Redis....");
        return JSON.parse(books);
      }

      //If books data is not cached then we load the books data from our database (books collection)

      const books = await bookCollection();
      const allBooks = await books.find({}).toArray();
      if (!allBooks) {
        //Could not get book list
        throw new GraphQLError(`Internal Server Error`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      // since books was not in redis and we loaded it from db, now we will store the books in Redis cache
      // Setting an expiration of 1 hour (1 hr = 60 min * 60 seconds = 3600 seconds) as mentioned in lab 3 ruberics
      client.set("books", JSON.stringify(allBooks));
      //Got this from reference -> https://dzone.com/articles/tutorial-working-nodejs-and under expire section
      //Was not able to directly set an expiery using client.set so had to find this client.expire solution from google
      client.expire("books", 3600);

      return allBooks;
    },

    getAuthorById: async (_, args) => {
      //checking if id is valid or not
      try {
        args._id = helpers.isValidUUID(args._id);

        //from professor's lab 2 lecture code
        // checking if author with given id is is stored in Redis cache or not
        const exists = await client.exists(`author:${args._id}`);

        if (exists) {
          //if we do have author with the given id data in cache, send data from cache
          console.log(`cache Hit!! Show author with id ${args._id} from cache`);
          let author = await client.get(`author:${args._id}`);
          console.log("Sending data from Redis....");
          return JSON.parse(author);
        }

        //If author data is not cached then we load the author with given id data from our database (author collection)

        const authors = await authorCollection();
        const author = await authors.findOne({ _id: args._id });
        if (!author) {
          //can't find the author
          throw new GraphQLError(`Author with ID - ${args._id} Not Found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // since aurthor with given id was not in redis and we loaded it from db, now we will store the author with given id in Redis cache
        client.set(`author:${args._id}`, JSON.stringify(author));
        // No expieration time as it is mentioned in lab 3 ruberics
        return author;
      } catch (error) {
        throw error;
      }
    },

    getBookById: async (_, args) => {
      //Checking if the id is valid or not
      try {
        args._id = helpers.isValidUUID(args._id);

        //from professor's lab 2 lecture code
        // checking if book with given id is is stored in Redis cache or not
        const exists = await client.exists(`book:${args._id}`);

        if (exists) {
          //if we do have book with the given id data in cache, send data from cache
          console.log(`cache Hit!! Show book with id ${args._id} from cache`);
          let book = await client.get(`book:${args._id}`);
          console.log("Sending data from Redis....");
          return JSON.parse(book);
        }

        //If book data is not cached then we load the book with given id data from our database (book collection)

        const books = await bookCollection();
        const book = await books.findOne({ _id: args._id });
        if (!book) {
          //can't find the book
          throw new GraphQLError(`book with ID - ${args._id} Not Found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // since book with given id was not in redis and we loaded it from db, now we will store the book with given id in Redis cache
        client.set(`book:${args._id}`, JSON.stringify(book));
        // No expieration time as it is mentioned in lab 3 ruberics
        return book;
      } catch (error) {
        throw error;
      }
    },

    booksByGenre: async (_, args) => {
      // Convert the genre to lowercase to ensure it's case insensitive
      try {
        const genre = helpers
          .checkString(args.genre, "Genre string")
          .toLowerCase();

        //from professor's lab 2 lecture code
        // checking if genre of books is stored in Redis cache or not
        const exists = await client.exists(`booksByGenre:${genre}`);

        if (exists) {
          //if we do have genre data in cache, send data from cache
          console.log(`cache Hit!! Show ${genre} genre of books from cache`);
          let cachedGenreBooks = await client.get(`booksByGenre:${genre}`);
          console.log("Sending data from Redis....");
          return JSON.parse(cachedGenreBooks);
        }

        //If genre data is not cached then we load the genre data from our database (book collection)

        const books = await bookCollection();
        // Reference -> https://sparkbyexamples.com/mongodb/mongodb-query-case-insensitive/?expand_article=1 using regex to do case insensitive find in mongo
        const genreBooks = await books
          .find({ genres: { $regex: new RegExp(genre, "i") } })
          .toArray();

        if (!genreBooks) {
          //can't find the book
          throw new GraphQLError(`books with ${args.genre} genre Not Found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // since books with given genre is not in redis and we loaded it from db, now we will store the books with given genre in Redis cache
        client.set(`booksByGenre:${genre}`, JSON.stringify(genreBooks));
        //Got this from reference -> https://dzone.com/articles/tutorial-working-nodejs-and under expire section
        //Was not able to directly set an expiery using client.set so had to find this client.expire solution from google
        client.expire(`booksByGenre:${genre}`, 3600);
        return genreBooks;
      } catch (error) {
        throw error;
      }
    },

    booksByPriceRange: async (_, args) => {
      //I'm now validating if my min and max are valid or not using my helper function
      helpers.isValidMinMax(args.min, args.max);

      //If the min and max is valid then i will check if my min_max price range is cached in redis or not
      // Create a cache key based on min and max values
      const bookPriceMinMaxCache = `booksByPriceRange:${args.min}-${args.max}`;

      // Checking if the price range cache exists in the Redis cache
      const exists = await client.exists(bookPriceMinMaxCache);

      if (exists) {
        // If data exists in cache, we will return it
        console.log(
          `Cache hit! Show books whose price is between ${args.min} and ${args.max} from cache`
        );
        let cachedBooks = await client.get(bookPriceMinMaxCache);
        console.log("Sending data from Redis...");
        return JSON.parse(cachedBooks);
      }

      //If data is not found in redis then we will retrieev books whose price fall between the above min max range from db
      const books = await bookCollection();
      //Took reference for getting range of values greater or less from here
      //reference -> https://copyprogramming.com/howto/gte-and-lte-in-mongodb
      const booksInMinMaxRange = await books
        .find({
          price: { $gte: args.min, $lte: args.max },
        })
        .toArray();

      //throwing an error if books not found in given range

      if (!booksInMinMaxRange) {
        throw new GraphQLError(
          `books with price range between ${args.min} and ${args.max} (inclusive) Not Found`,
          {
            extensions: { code: "NOT_FOUND" },
          }
        );
      }

      // now since we fetched the data, lets store the fetched data in Redis cache with an expiry of 1 hour = 3600 seconds
      client.set(bookPriceMinMaxCache, JSON.stringify(booksInMinMaxRange));
      client.expire(bookPriceMinMaxCache, 3600);

      return booksInMinMaxRange;
    },

    searchAuthorsByName: async (_, args) => {
      //Search term should be a valid string
      let searchTerm = helpers.checkString(args.searchTerm, "Search Term");

      // making search term case insensitive
      searchTerm = searchTerm.toLowerCase();
      //console.log("Search term called", searchTerm);

      //Checking if the search term exists in redis
      const searchTermCacheKey = `searchTerm:${searchTerm}`;
      const exists = await client.exists(searchTermCacheKey);

      if (exists) {
        // If searchTerm data exists in cache, we will return it
        console.log(
          `Cache hit! Show Search Terms whose authors first name or last name has '${searchTerm}' in it from cache`
        );
        let cachedAuthors = await client.get(searchTermCacheKey);
        console.log("Sending data from Redis...");
        return JSON.parse(cachedAuthors);
      }

      //If the search term is not cached in redis then we have to load all authors whose first name or last name has the search term from db
      const authors = await authorCollection();
      // Reference -> https://sparkbyexamples.com/mongodb/mongodb-query-case-insensitive/?expand_article=1 using regex to do case insensitive find in mongo
      const caseInsensitiveRegex = new RegExp(searchTerm, "i");
      //reference -> https://www.mongodb.com/docs/manual/reference/operator/query/or/#:~:text=The%20%24or%20operator%20performs%20a,one%20of%20the%20.
      const authorList = await authors
        .find({
          $or: [
            { first_name: caseInsensitiveRegex },
            { last_name: caseInsensitiveRegex },
          ],
        })
        .toArray();

      //console.log("List -> ", authorList);

      //If i am getting empty array or if authors List doesn't exist then i will return an empty array and i won't update redis
      if (!authorList || authorList.length === 0) {
        return authorList;
      }

      // after we get a list of nun empty authors list from given search term we will store it in redis
      await client.set(searchTermCacheKey, JSON.stringify(authorList));
      //Setting expiery time as 1 hour = 3600 seconds as mentioned in lab 3 ruberics
      await client.expire(searchTermCacheKey, 3600);

      return authorList;
    },
  },
  Book: {
    //We need the author who wrote this book, so writing it's resolver here
    //Took this logic from professor's lecture code for server example
    author: async (parentValue) => {
      //console.log(`parentValue in Book`, parentValue);

      //First i will check if the book whose author id is parentValue.authorId is cached in my redis or not
      //if it is cached i will return it from my redis cache

      const key = `author:${parentValue.authorId}`;

      const exists = await client.exists(key);

      if (exists) {
        console.log(
          `cache Hit!! Show author with id ${parentValue.authorId} from cache`
        );
        let author = await client.get(key);
        return JSON.parse(author);
      }

      //If the author with given authorId is not found in redis cache then we will load it from our db
      const authors = await authorCollection();
      const author = await authors.findOne({ _id: parentValue.authorId });

      if (!author) {
        throw new GraphQLError(
          `Author with ID - ${parentValue.authorId} Not Found`,
          {
            extensions: { code: "NOT_FOUND" },
          }
        );
      }

      // After loading from db we will set author to our redis cache
      client.set(key, JSON.stringify(author));

      return author;
    },
  },
  Author: {
    //Took reference from professors lecture code in server
    numOfBooks: async (parentValue) => {
      //console.log(`parentValue in Author`, parentValue);
      // Check if the books field exists and is an array. If not, return 0.
      //since the author collection has a list of book id's so i can directly count the number bookID's of elements in this books list from author
      //doing additional check to make sure if it is empty then i return 0 as count of books written by that author using ternarry operator
      return Array.isArray(parentValue.books) ? parentValue.books.length : 0;
      // const books = await bookCollection();
      // //Getting count of number of books from books collection where the book's authorId matches our author's ID from parentValue
      // const numOfBooks = await books.count({ authorId: parentValue._id });
      // return numOfBooks;
    },
    books: async (parentValue, args) => {
      //getting limit from args
      const limit = args.limit;

      // Checking if the limit is supplied and is a valid number greater than 0, if this conition is not met then i will throw an error
      //If my limit is undefined that means the user has not given any limit hence i am letting it pass and in my code down below i manually set it to 0

      if (limit !== undefined && (typeof limit !== "number" || limit <= 0)) {
        throw new GraphQLError(
          "Invalid limit. Limit should be a whole number greater than 0",
          {
            extensions: { code: "Invalid_Limit" },
          }
        );
      }

      //Now after validating my limit i will fetch all the books written by this author, i.e all the book's whose id matches my author's bookID

      const books = await bookCollection();
      //Reference for using $in operator -> https://www.mongodb.com/docs/manual/reference/operator/query/in/
      const booksByAutor = await books
        .find({ _id: { $in: parentValue.books } })
        .limit(limit || 0)
        .toArray();

      //referrence for limit -> https://www.mongodb.com/docs/manual/reference/method/cursor.limit/#:~:text=A%20limit()%20value%20of,equivalent%20to%20setting%20no%20limit.
      //from the above reference i found out if we set limit to 0 it renders all

      return booksByAutor;
    },
  },
  Mutation: {
    //This mutation will create an Author and will save the Author in MongoDB
    addAuthor: async (_, args) => {
      //checking if all the arg variables are valid string or not
      let first_name = helpers.checkString(args.first_name, "First Name");
      let last_name = helpers.checkString(args.last_name, "Last Name");
      let date_of_birth = helpers.checkString(
        args.date_of_birth,
        "Date of Birth"
      );
      let hometownCity = helpers.checkString(
        args.hometownCity,
        "Home Town City"
      );
      let hometownState = helpers.checkString(
        args.hometownState,
        "Home Town State"
      );

      //checking if it is valid first and last name
      helpers.isValidFirstNameLastName(first_name, "first_name");
      helpers.isValidFirstNameLastName(last_name, "last_name");

      //Checking if date is in mm/dd/yyyy format or not
      helpers.isValidDate(date_of_birth);

      //Checking valid us state
      helpers.isValidUSstate(hometownState);

      // So far everything went well so creating Author object!

      const newAuthor = {
        _id: uuid(),
        first_name: first_name,
        last_name: last_name,
        date_of_birth: date_of_birth,
        hometownCity: hometownCity,
        hometownState: hometownState,
        books: [],
        numOfBooks: 0,
      };

      const authors = await authorCollection();

      //Inserting to my DB
      let insertAuthor = await authors.insertOne(newAuthor);
      if (!insertAuthor.acknowledged || !insertAuthor.insertedId) {
        throw new GraphQLError(`Could not Add Author`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      //Now i will also add this to my redis cache to store author that is created now
      client.set(
        `author:${newAuthor._id.toString()}`,
        JSON.stringify(newAuthor)
      );

      return newAuthor;
    },

    //This mutation will take care of any updates that we want to perform on a particular Author
    editAuthor: async (_, args) => {
      //For editing id should be mandatorily provided, hence checking if id is present and if it is valid uuid or not
      args._id = helpers.isValidUUID(args._id);

      //getting the author object that has to be edited, by given authorID
      const authors = await authorCollection();
      let author = await authors.findOne({ _id: args._id });

      //Checking if author with given authorID exist in db or not, if it exist then i will validate my inputs
      //Now checking if the update args contains the corresponding field and if it is provided then checking if it is valid type or not
      if (author) {
        if (args.first_name) {
          args.first_name = helpers.checkString(args.first_name, "First Name");
          helpers.isValidFirstNameLastName(args.first_name, "First Name");
          //if this field is provided and if it is valid then update in retrieved author
          author.first_name = args.first_name;
        }
        if (args.last_name) {
          args.last_name = helpers.checkString(args.last_name, "Last Name");
          helpers.isValidFirstNameLastName(args.last_name, "Last Name");
          //if this field is provided and if it is valid then update in retrieved author
          author.last_name = args.last_name;
        }
        if (args.date_of_birth) {
          args.date_of_birth = helpers.checkString(
            args.date_of_birth,
            "Date of Birth"
          );
          helpers.isValidDate(args.date_of_birth);
          //if this field is provided and if it is valid then update in retrieved author
          author.date_of_birth = args.date_of_birth;
        }
        if (args.hometownCity) {
          args.hometownCity = helpers.checkString(
            args.hometownCity,
            "Home Town City"
          );
          //if this field is provided and if it is valid then update in retrieved author
          author.hometownCity = args.hometownCity;
        }
        if (args.hometownState) {
          args.hometownState = helpers.checkString(
            args.hometownState,
            "Home Town State"
          );
          helpers.isValidUSstate(args.hometownState);
          //if this field is provided and if it is valid then update in retrieved author
          author.hometownState = args.hometownState;
        }
        //if all the above is valid then i will update the author in my db
        await authors.updateOne({ _id: args._id }, { $set: author });
      } else {
        throw new GraphQLError(
          `Could not update Author with _id of ${args._id}`,
          {
            extensions: { code: "NOT_FOUND" },
          }
        );
      }

      //now since my db has updated the author and persisted the changes, i will delete my redis cache if it has the author:key , and then create a fresh redis cache

      let authorRedisKey = `author:${args._id}`;

      // checking if author with given id is is stored in Redis cache or not
      const exists = await client.exists(authorRedisKey);

      if (exists) {
        //if we do have author with the given id data in cache, send data from cache
        console.log(
          `cache Hit!! Removing existing author with id ${args._id} from cache`
        );
        //logic to remove redis key
        await client.del(authorRedisKey);
      }

      //now adding the author to redis cache
      await client.set(authorRedisKey, JSON.stringify(author));

      await client.del("authors");

      return author;
    },

    //This Deletes an Author from the MongoDB collection and remove them from the Redis cache. also delete ALL books that the deleted author has written
    removeAuthor: async (_, args) => {
      //Author id is mandatory so i will check if it is provided, and if it is a valid uuid type
      args._id = helpers.isValidUUID(args._id);

      //collections
      const authors = await authorCollection();
      const books = await bookCollection();

      //checking if the author exist in authorcollection with given autherId
      const author = await authors.findOne({ _id: args._id });

      //If auther doesn't exist then we can't remove it so I will throw an error to notify the user
      if (!author) {
        throw new GraphQLError(`Author with _id of ${args._id} not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Now i will iterate through each book id in the author's books array and delete the book from the books collection
      for (const authorBookId of author.books) {
        // I will Delete the book from the books collection
        const deletedBook = await books.findOneAndDelete({ _id: authorBookId });
        // if i am not able ot find the book then i will just log it but i will keep continue to delete
        // i just did this to handle an edge case if there is inconsistency in the db
        // but ideally this will not occur if the seed file has consistant data
        if (!deletedBook) {
          console.log(`Could not delete book with id of ${authorBookId}`);
          continue;
        }

        // now I will delete the book from the Redis cache
        let bookRedisKey = `book:${authorBookId}`;
        await client.del(bookRedisKey);
      }

      // i deleted the books associated with author first and then attempting to delete the author
      // i did this as i found this way of doing to technically not cause any inconsistency
      await authors.deleteOne({ _id: args._id });

      // now i will also delete the author from the Redis cache
      let authorRedisKey = `author:${args._id}`;
      await client.del(authorRedisKey);

      // to make sure the authors redis collection is consistent i will also delete authors from the authors redis cache
      await client.del("authors");
      // i am also deleting books redis collection as i don't want to have inconsistnt data
      await client.del("books");

      return author;
    },

    addBook: async (_, args) => {
      //checking if inputs are valid or not (checking string type first)
      args.title = helpers.checkString(args.title, "Title");
      args.publicationDate = helpers.checkString(
        args.publicationDate,
        "Publication Date"
      );
      args.publisher = helpers.checkString(args.publisher, "Publisher");
      args.summary = helpers.checkString(args.summary, "Summary");
      args.isbn = helpers.checkString(args.isbn, "ISBN");
      args.language = helpers.checkString(args.language, "Language");
      args.authorId = helpers.checkString(args.authorId, "Author ID");

      //Checking if autherID is a valid uuid
      args.authorId = helpers.isValidUUID(args.authorId);

      // now checking integers
      helpers.isValidPageCount(args.pageCount);
      helpers.isValidPrice(args.price);

      //checking array type input elements
      //I am passing key value paris and this will check if array in each key is valid or not
      helpers.isValidArrayElements({
        genres: args.genres,
        format: args.format,
      });

      //checking if the date is valid or not
      helpers.isValidDate(args.publicationDate);

      //checking if ISBN is valid 10 or 13
      helpers.isValidISBN(args.isbn);

      // Checking if authorId given in the args is valid or not
      const authors = await authorCollection();
      const author = await authors.findOne({ _id: args.authorId });
      if (!author) {
        throw new GraphQLError(
          `Author with _id of ${args.authorId} not found.`
        );
      }

      //now adding book to book collection
      const newBook = {
        _id: uuid(),
        title: args.title,
        genres: args.genres,
        publicationDate: args.publicationDate,
        publisher: args.publisher,
        summary: args.summary,
        isbn: args.isbn,
        language: args.language,
        pageCount: args.pageCount,
        price: args.price,
        format: args.format,
        authorId: args.authorId,
      };

      const books = await bookCollection();

      //Inserting to my DB
      let insertBook = await books.insertOne(newBook);
      if (!insertBook.acknowledged || !insertBook.insertedId) {
        throw new GraphQLError(`Could not Add Book`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      // also have to add the books to authors collection
      const updateAuthorBook = await authors.updateOne(
        { _id: args.authorId },
        { $push: { books: newBook._id } }
      );
      if (!updateAuthorBook.acknowledged || !updateAuthorBook.modifiedCount)
        throw {
          text: "Could not update the books in author.",
          code: "500 : INTERNAL_SERVER_ERROR",
        };

      // now i will add author to redis if it doesn't exist
      let authorRedisKey = `author:${args.authorId}`;

      // checking if author with given id is is stored in Redis cache or not
      const exists = await client.exists(authorRedisKey);

      if (exists) {
        //if we do have author with the given id data in cache, send data from cache
        console.log(
          `cache Hit!! redis has author with id ${args.authorId} in its cache`
        );
      } else {
        console.log(
          `Redis doesn't have the auther with ${args.authorId} ID, hence adding it to redis cache!`
        );
        client.set(authorRedisKey, JSON.stringify(author));
      }

      // Now adding book to Redis cache
      const bookRedisKey = `book:${newBook._id.toString()}`;
      await client.set(bookRedisKey, JSON.stringify(newBook));

      // I WILL ALSO DELETE THE AUTHORS AND BOOKS COLLECTION FROM REDIS TO MAINTAIN UI CONSISTENCY
      await client.del("books");
      await client.del("authors");
      await client.del(`author:${args.authorId}`);

      return newBook;
    },

    editBook: async (_, args) => {
      try {
        const { _id, ...updateFields } = args;
        // Checking if bookID is valid uuid or not
        const bookId = helpers.isValidUUID(_id);

        if (Object.keys(updateFields).length === 0) {
          throw new Error(
            "At least one of the field to update must be provided.",
            "400 : BAD_USER_INPUT"
          );
        }

        const booksCollection = await bookCollection();
        const authorsCollection = await authorCollection();
        const bookToUpdate = await booksCollection.findOne({ _id: bookId });

        if (!bookToUpdate) {
          throw new Error(
            `Could not find book with id ${bookId}`,
            "404 : NOT_FOUND"
          );
        }

        //Checking if autherID is a valid uuid
        let authorId = updateFields.authorId
          ? helpers.isValidUUID(updateFields.authorId)
          : bookToUpdate.authorId;
        const author = await authorsCollection.findOne({ _id: authorId });
        if (!author) {
          throw new Error("Author Not Found", "404: NOT_FOUND");
        }

        const dateOfBirth = author.date_of_birth;
        Object.keys(updateFields).forEach((field) => {
          if (field === "title")
            bookToUpdate.title = helpers.checkString(
              updateFields.title,
              "Title"
            );
          else if (field === "genres") {
            //I am passing key value paris and this will check if array in each key is valid or not
            helpers.isValidArrayElements({
              genres: updateFields.genres,
            });
            bookToUpdate.genres = updateFields.genres;
          } else if (field === "publicationDate") {
            bookToUpdate.publicationDate = helpers.checkString(
              updateFields.publicationDate,
              "Publication Date"
            );
            helpers.isValidDate(updateFields.publicationDate);
          } else if (field === "publisher")
            bookToUpdate.publisher = helpers.checkString(
              updateFields.publisher,
              "Publisher"
            );
          else if (field === "summary")
            bookToUpdate.summary = helpers.checkString(
              updateFields.summary,
              "Summary"
            );
          else if (field === "isbn") {
            console.log("Isbn is called ", updateFields.isbn);
            bookToUpdate.isbn = helpers.checkString(updateFields.isbn, "ISBN");
            //checking if ISBN is valid 10 or 13
            helpers.isValidISBN(updateFields.isbn);
          } else if (field === "language")
            bookToUpdate.language = helpers.checkString(
              updateFields.language,
              "Language"
            );
          else if (field === "pageCount")
            // now checking integers
            helpers.isValidPageCount(updateFields.pageCount);
          else if (field === "price") {
            // Checking if the price is valid or not
            helpers.isValidPrice(updateFields.price);
            bookToUpdate.price = updateFields.price;
          } else if (field === "format") {
            //I am passing key value paris and this will check if array in each key is valid or not
            helpers.isValidArrayElements({
              format: updateFields.format,
            });
            bookToUpdate.format = updateFields.format;
          } else if (field === "authorId") bookToUpdate.authorId = authorId;
        });

        if (authorId && bookToUpdate.authorId !== authorId) {
          const updateOldAuthor = await authorsCollection.updateOne(
            { _id: bookToUpdate.authorId },
            { $pull: { books: bookId } }
          );
          const updateNewAuthor = await authorsCollection.updateOne(
            { _id: authorId },
            { $push: { books: bookId } }
          );

          if (
            !updateOldAuthor.acknowledged ||
            !updateOldAuthor.modifiedCount ||
            !updateNewAuthor.acknowledged ||
            !updateNewAuthor.modifiedCount
          ) {
            throw new Error(
              "Couldn't update the books array in author collection.",
              "500 : INTERNAL_SERVER_ERROR"
            );
          }

          const oldAuthorCacheKey = `author:${bookToUpdate.authorId}`;
          const newAuthorCacheKey = `author:${authorId}`;
          let oldAuthorCached = await client.exists(oldAuthorCacheKey);
          let newAuthorCached = await client.exists(newAuthorCacheKey);
          if (oldAuthorCached) await client.del(oldAuthorCacheKey);
          if (newAuthorCached) await client.del(newAuthorCacheKey);
        }

        console.log("Book to update - ", bookToUpdate);
        const updateResult = await booksCollection.updateOne(
          { _id: bookId },
          { $set: bookToUpdate }
        );

        if (!updateResult.acknowledged || !updateResult.modifiedCount) {
          throw new Error(
            `Could not update Book with _id of ${bookId}.`,
            "500 : INTERNAL_SERVER_ERROR"
          );
        }

        const updatedBook = await booksCollection.findOne({ _id: bookId });
        //now adding the updated book to redis cache
        const updatedBookCacheKey = `book:${bookId}`;
        await client.set(updatedBookCacheKey, JSON.stringify(updatedBook));

        // initially I just thought of doing await client.del("books") but then it felt too easy so i did the following
        // Updating the 'books' cache (i am trying to update the books cache and replace it with the updated book)

        const booksCache = await client.get("books");
        if (booksCache) {
          let books = JSON.parse(booksCache);
          const bookIndex = books.findIndex((book) => book._id === bookId);
          if (bookIndex !== -1) {
            books[bookIndex] = updatedBook; // Updating the book in the books cache array
            await client.set("books", JSON.stringify(books)); // Now I will set the updated books array back into the cache
          }
        }

        return updatedBook;
      } catch (e) {
        throw new GraphQLError(
          e?.message ? e.message : "Internal Server Error",
          {
            extensions: {
              code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
            },
          }
        );
      }
    },

    removeBook: async (_, args) => {
      // id is a required field so first i will check if it is given and if so i will check if it is a valid uuid type or not
      args._id = helpers.isValidUUID(args._id);

      //Collections for books and authors
      const books = await bookCollection();
      const authors = await authorCollection();

      // Checking if the book exists using the provided bookID
      const book = await books.findOne({ _id: args._id });
      if (!book) {
        throw new GraphQLError(`Book with _id of ${args._id} not found.`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Removing the book from the books collection
      await books.deleteOne({ _id: args._id });

      // also removing the book from redis cache
      await client.del(`book:${args._id}`);

      // If the book had an author,then i have to update the author's list of books
      if (book.authorId) {
        // Updating the author's books collection to remove the deleted book's ID
        await authors.updateOne(
          { _id: book.authorId },
          { $pull: { books: args._id } }
        );

        // removing the author from redis cache to reset auther with given autherID cache
        await client.del(`author:${book.authorId}`);
      }

      // to maintain consistency for my React UI - i will delete the redis cache for authors and books collection
      await client.del("books");
      await client.del("authors");

      return book;
    },
  },
};
