import React from 'react';
import './BookCard.css';

const BookCard = ({ book, handleOrder, handleCancelOrder, isOrdered, orders }) => {
  const { title, writer, coverImage, price, tags } = book;

  return (
    <div className="book-card">
      <img className="book-image" src={coverImage} alt={title} />
      <div className="book-details">
        <h2 className="book-title"> {title}</h2>
        <p className="book-writer">By {writer}</p>
        <p className="book-price">${price}</p>
        <div className="book-tags">
          {tags.map((tag) => (
            <span key={tag} className="book-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="button-container">
          {!(orders.find(order=>order.bookId === book.id)) && <button className="order-button" onClick={() => handleOrder(book.id)}>
            Order
          </button>}
          {(orders.find(order=>order.bookId === book.id))  && <button className="cancel-button" onClick={() => handleCancelOrder(book.id)}>
            Cancel Order
          </button>}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
