import React, { useEffect, useState } from 'react';
import BookList from '../BookList/BookList';
const Home = () => {

    return (
        <div>
            <h1 style={{textAlign: 'center', margin: '10px'}}> Welcome to Bookstore</h1>
            <BookList />
        </div>
    );
};

export default Home;