# BookVerse

Welcome to BookVerse, a web platform I meticulously crafted to bring together book lovers, authors, and librarians. As an avid reader and tech enthusiast, I designed BookVerse to provide a seamless experience for managing and discovering literary works and their creators.

## Introduction

BookVerse is a unique intersection of literature and technology. It's a platform where individuals can explore the realms of authors and their contributions to the literary world. This website aims to solve the challenge of tracking literary works and their authors, offering a robust solution for those who wish to keep detailed records of books and authorship. Whether you're a book collector, a librarian curating a collection, or just a reader with a voracious appetite for organized knowledge, BookVerse is tailored for you.

## Collections and Relationships

The heart of BookVerse lies in its two main collections: `Books` and `Authors`. These collections are intrinsically linked, reflecting the real-world relationship between a book and its author(s). An `Author` can have a list of `Books` they've penned, while each `Book` maintains a reference to its creator. This relational aspect facilitates operations like adding, updating, or deleting records for books or authors, providing a dynamic and interactive experience.

## Technology Stack

### Backend

- **Express.js**: Offers a robust framework for our server, simplifying the setup of routes and middleware.
- **GraphQL**: Serves as the backbone for our API, enabling complex CRUD operations with simplified queries and mutations compared to traditional REST APIs. This has allowed me to deepen my understanding of efficient data retrieval and manipulation.
- **Redis**: Empowers the application with caching mechanisms, significantly improving data retrieval times and reducing server load, resulting in a snappy user experience.

### Frontend

- **React**: The choice of React has allowed me to build a dynamic and responsive user interface, honing my skills in component-based architecture and state management.
- **Vite**: This modern build tool enabled me to set up a lightweight and fast-reacting frontend environment, enhancing my development workflow.
- **Tailwind CSS & Material UI**: The integration of these styling frameworks has been pivotal in crafting a visually appealing and intuitive layout with minimal fuss, allowing me to focus more on functionality rather than styling nitty-gritty.

## Features

- Dynamic search functionality for books and authors.
- Real-time addition and deletion of books and authors.
- Editing capabilities for existing records, ensuring data is current and accurate.
- Caching with Redis for efficient data fetching.
- Responsive design that caters to various devices and screen sizes.

## Setup Instructions

To get BookVerse up and running on your local machine, follow these steps:

### Prerequisites
Before you begin, make sure you have the following installed:
- Node.js and npm (Node Package Manager)
- MongoDB Compass (to view and manage your MongoDB database)
- Redis (for caching data)
- GraphQL

### Backend Setup
1. Clone the BookVerse repository to your local machine.
2. Navigate to the `BookVerse` folder, then change directory to the `server` folder using the terminal or command prompt:
    ```sh
    cd server
    ```
3. Install all necessary dependencies:
    ```sh
    npm install
    ```
4. Seed the initial books and authors collection to MongoDB:
    ```sh
    npm run seed
    ```
5. Start the Express Server with GraphQL and Redis on localhost port 4000:
    ```sh
    npm start
    ```

### Frontend Setup
1. Open a new terminal or command prompt instance.
2. From the `BookVerse` folder, navigate to the `react_client` folder:
    ```sh
    cd react_client
    ```
3. Install all the dependencies:
    ```sh
    npm install
    ```
4. Run the Vite + React application:
    ```sh
    npm start
    ```
5. Open your web browser and go to `http://localhost:3000/` to view the BookVerse application live.


## Final Thoughts

Developing BookVerse has been a journey of growth and learning. Each line of code has brought me closer to mastering the stack I chose. The seamless interaction between the frontend and backend stands testimony to the power of modern web technologies. With GraphQL and Redis on the backend and React's prowess on the frontend, BookVerse stands as a testament to what's possible when passion meets technology.

---

Thank you for exploring BookVerse. Your journey into the world of books and authors starts now. Dive in!

