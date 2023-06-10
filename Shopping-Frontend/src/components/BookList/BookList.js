import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import BookCard from './BookCard';
import './BookCard.css';
import UserForm from '../UserForm/UserForm';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [userExists, setUserExists] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOrdered, setIsOrdered] = useState(false);
  const [allDataFetched, setAllDataFetched] = useState(false);

  useEffect(() => {
    checkUserExists();
    fetchBooks();
    getOrder();
  }, []);

  useEffect(() => {
    getOrder();
  }, [orders]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/books');
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScroll = async (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !loading && !allDataFetched) {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/books');
        const newData = response.data;
        if (newData.length === 0 || newData.length === books.length) {
          // No new data available or all data already fetched, disable infinite scrolling
          setAllDataFetched(true);
          setLoading(false);
          return;
        }
        setBooks((prevBooks) => [...prevBooks, ...newData]);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  
  

  const handleUserCreation = (userId) => {
    // Handle successful user creation
    // Update state variables, show book cards, etc.
    setUserExists(true);
  };

  const checkUserExists = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/customers');
      console.log(response.data.length)
      setUserExists(response.data.length);
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message to the user
    }
  };

const handleOrder = (bookId) => {
    // Send a POST request to create a new order
    axios.post('http://localhost:4000/api/orders', { customerId: 1, bookId })
      .then((response) => {
        console.log('Order placed successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error placing order:', error);
      });
      fetchBooks();
      getOrder();
      setIsOrdered(true);
      alert("Order Placed Successfully")
  };

  const getOrder = () => {
    // Send a POST request to create a new order
    axios.get('http://localhost:4000/api/orders')
      .then((response) => {
        console.log('Order placed successfully:', response.data);
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Error placing order:', error);
      });

  };
  
  const handleCancelOrder = (bookId) => {
    // Send a DELETE request to cancel the order
    axios.delete(`http://localhost:4000/api/orders/${bookId}`)
      .then((response) => {
        console.log('Order canceled successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error canceling order:', error);
      });

      setIsOrdered(false);
      fetchBooks();
      getOrder();
      alert("Order cancelled Successfully")
  };
  
  // ...
  

  return (
    <div onScroll={handleScroll} style={{ height: '100vh', overflow: 'auto' }}>
    {
        userExists > 0 ? <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gridGap: '20px',
          padding: '10px',
        }}
      >
        {books.map((book) => (
          <BookCard key={book.id} book={book} handleOrder={handleOrder} handleCancelOrder={handleCancelOrder} isOrdered={isOrdered} orders={orders}/>
        ))}
      </div> :  <UserForm handleUserCreation={handleUserCreation} />
    }
    {loading && <p>Loading...</p>}
  </div>
  );
};

export default BookList;
