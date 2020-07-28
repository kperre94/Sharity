import React, { useState } from 'react';
import IndivCards from './cardsSubComponents/indivCards.jsx';
import styles from '../LandingSubComponents/Cards.css';

const Cards = ({ items, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>
  }
  return (
    <div>
      <p>Cards</p>
      <div>
        {/* Sorting Buttons */}
        <button>Name</button>
        <button>Date</button>
        <button>Distance</button>
        <button>Category</button>
      </div>
      {/* {styles.cardsParent} */}
      <ul className={styles.cardsParent}>
        {/* <IndivCards /> */}
        {/* Mapping Component for the cards */}
        
        {items.map((item) => (
          <IndivCards key={item._id} item={item} className="list-group-item" />
          // {item.name}
        ))}
        {/* <Pagination total={50}/> */}
        
      </ul>
    </div>
  )
}

export default Cards;