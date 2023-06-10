const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Create database connection
const db = new sqlite3.Database(':memory:'); // Change to the appropriate database file path in a production environment

// Create the books table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    writer TEXT,
    coverImage TEXT,
    price REAL,
    tags TEXT
  )`);

  // Insert sample data into books table
  const booksData = [
    {
      title: 'Book 1',
      writer: 'Writer 1',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
      price: 9,
      tags: ['fiction', 'mystery'],
    },
    {
      title: 'Book 2',
      writer: 'Writer 2',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
      price: 14,
      tags: ['non-fiction', 'biography'],
    },
    {
      title: 'Book 3',
      writer: 'Writer 3',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
      price: 18,
      tags: ['fiction', 'biography'],
    },
    {
      title: 'Book 4',
      writer: 'Writer 4',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
      price: 16,
      tags: ['fiction', 'science'],
    },
    {
      title: 'Book 5',
      writer: 'Writer 5',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
      price: 10,
      tags: ['non-fiction', 'essay'],
    },
    {
      title: 'Book 6',
      writer: 'Writer 6',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
      price: 5,
      tags: ['non-fiction', 'fiction'],
    },
    {
      title: 'Book 7',
      writer: 'Writer 7',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
      price: 5,
      tags: ['non-fiction', 'fiction'],
    },
    {
      title: 'Book 8',
      writer: 'Writer 8',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
      price: 5,
      tags: ['non-fiction', 'fiction'],
    },
    {
      title: 'Book 9',
      writer: 'Writer 9',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
      price: 5,
      tags: ['non-fiction', 'fiction'],
    },
    // Add more sample books as needed
  ];

  const insertBook = db.prepare(
    'INSERT INTO books (title, writer, coverImage, price, tags) VALUES (?, ?, ?, ?, ?)'
  );

  booksData.forEach((book) => {
    insertBook.run(
      book.title,
      book.writer,
      book.coverImage,
      book.price,
      JSON.stringify(book.tags)
    );
  });

  insertBook.finalize();

  console.log('Connected to the bookstore database');
});

// Create the customers table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 100
  )`);
  // Create dummy customers in the database
  // db.serialize(() => {
  //   db.run(`INSERT INTO customers (name, email, points) VALUES ('John Doe', 'john.doe@example.com', 100)`);
  //   db.run(`INSERT INTO customers (name, email, points) VALUES ('Jane Smith', 'jane.smith@example.com', 150)`);
  //   db.run(`INSERT INTO customers (name, email, points) VALUES ('Michael Johnson', 'michael.johnson@example.com', 200)`);

  //   console.log('Dummy customers created');
  // });

  // Create the orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerId INTEGER NOT NULL,
  bookId INTEGER NOT NULL,
  status TEXT NOT NULL,
  FOREIGN KEY (customerId) REFERENCES customers (id),
  FOREIGN KEY (bookId) REFERENCES books (id)
  )`);

  console.log('Connected to the bookstore database');
});

app.post('/api/customers', (req, res) => {
  const { name, email, password } = req.body;

  // Insert the new customer into the database
  db.run(
    'INSERT INTO customers (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const customerId = this.lastID;

        // Assign 100 points to the new customer
        db.run(
          'UPDATE customers SET points = 100 WHERE id = ?',
          customerId,
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.json({ customerId });
            }
          }
        );
      }
    }
  );
});




// Define routes
app.get('/api/books', (req, res) => {
  // Fetch books from the database
  db.all('SELECT * FROM books', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Parse the tags array from the stored JSON string
      const books = rows.map((row) => ({
        ...row,
        tags: JSON.parse(row.tags),
      }));
      res.json(books);
    }
  });
});
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve customers' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/orders', (req, res) => {
  const { customerId, bookId } = req.body;

  // Check if the customer has enough points to buy the book
  db.get('SELECT points FROM customers WHERE id = ?', customerId, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const points = row?.points;

      // Get the price of the book from the books table
      db.get('SELECT price FROM books WHERE id = ?', bookId, (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const price = row?.price;

          // Check if the customer has enough points to buy the book
          if (points >= price) {
            // Deduct the price from the customer's points
            const remainingPoints = points - price;
            db.run(
              'UPDATE customers SET points = ? WHERE id = ?',
              [remainingPoints, customerId],
              (err) => {
                if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Internal Server Error' });
                } else {
                  // Insert the new order into the orders table
                  db.run(
                    'INSERT INTO orders (customerId, bookId, status) VALUES (?, ?, ?)',
                    [customerId, bookId, 'completed'],
                    function (err) {
                      if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Internal Server Error' });
                      } else {
                        res.json({ message: 'Order created successfully' });
                      }
                    }
                  );
                }
              }
            );
          } else {
            res.status(400).json({ error: 'Insufficient points to buy the book' });
          }
        }
      });
    }
  });
});


app.get('/api/orders', (req, res) => {
  // Fetch all orders from the database
  db.all('SELECT * FROM orders', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

app.delete('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;

  // Delete the order from the database
  db.run('DELETE FROM orders WHERE bookId = ?', orderId, function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Order cancelled successfully' });
    }
  });
});

app.get('/api/buy-history', (req, res) => {
  const { customerId } = req.query;

  // Fetch the buy history of the customer from the database
  db.all(
    'SELECT books.title, books.writer, orders.status FROM orders INNER JOIN books ON orders.bookId = books.id WHERE orders.BookId = books.id',
    [customerId],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(rows);
      }
    }
  );
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
