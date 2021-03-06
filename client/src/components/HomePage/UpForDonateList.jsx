import React, { useState, useEffect } from 'react';
import styles from '../../styles/lists.css';
import Axios from 'axios';

var _ = require('lodash');

const DonatedList = ({ displayCard }) => {
    //sets title and sort options for list
    var title='Up for Donation'
    var sortOptions = ['dateCreated', 'estimatedValue', 'name', 'category'];
    //set states of data and sort options
    const [filteredData, setData] = useState([])
    const [sortType, setSortType] = useState('dateCreated');
    
    useEffect(() => {
        getUserItemsData()
    }, []);
    //gets the data of user items taht are available for donation
    function getUserItemsData () {

        //if no local storage exists, then do nothing
        if(!localStorage.getItem('user')) {
            return;
        }
        //to push data from get request and tax rows
        var arrayToDonateData = []

        //user info from local storage
        const userData = JSON.parse(localStorage.getItem('user'))
        var userType = userData.type;

        //if not user then change to donor for db query
        if(userType === "user") {
            userType = "donor"
        }
        //user info to use with get request
        var userDataObj = {
            userType: userType,
            email: userData.email
        }
        //request to database with user data
        Axios.get('/items/items', {params: userDataObj})
        .then(res => {
            //pushed to data array if has been picked up and claimed
            res.data.items.map((item) => {
                //if data is not picked up or claimed
                if(item.pickedUp === false  && item.claimedBy == null ) {
                    //makes the date look pretty
                    item.date =  `${item.dateCreated.slice(5,7)}/${item.dateCreated.slice(8,10)}/${item.dateCreated.slice(2,4)} @${item.dateCreated.slice(11,16)}`
                    
                    //fixes bug for sorting and null values
                    if(item.name !== null && item.category !== null ) {
                        //assign new keys for sorting rows more easily
                        item.lowerCaseName = item.name.toLowerCase();
                        item.lowerCaseCategory = item.category.toLowerCase();
                    }

                    //to sort values 
                    item.value = parseInt(item.estimatedValue)
                    
                    //push data into storage array
                    arrayToDonateData.push(item);
                }
            })    
        }) //sets state of pickup data with storage array data
        .then(res => {
            setData(arrayToDonateData)
        })
        .catch(err => {
            console.log(err)
        })
    }

    //handles the sorting of the selector
    const handleSort = (event, name) => {
        event.preventDefault();
        setSortType(name);
        sortArray(name)
    }
        
    //deletes an item that user no longer wishes to donate
    function onDeleteItem (id) {
        //if no local storage exists, then do nothing
        if(!localStorage.getItem('user')) {
            return;
        }
        //user info from local storage
        const userData = JSON.parse(localStorage.getItem('user'))
        
        var data = {
            _id: id,
            email: userData.email,
            userType: userData.userType
        }

        Axios.delete('/items', 
        {params: data} )
        .then(res => {
            getUserItemsData();
        })
        .catch(err => {
            console.log('axios error deleting item from the DB: ', err)
        })
    }

    //object keys for sorting the data
    const sortArray = type => {
        const types = {
            claimedBy: 'claimedBy', 
            dateCreated:'date', 
            estimatedValue: 'value', 
            name: 'lowerCaseName', 
            category: 'lowerCaseCategory',
            Location: 'Location'
        };

        //defines the option that was selected in the dropdown by user
        const sortProperty = types[type]; 
        //sorting function compares data from the fakeData file           
        const sorted = _.orderBy(filteredData, [sortProperty, 'asc'])
        setData(sorted)
    };

    return (
        <div className={styles.listWrap}>
            <div className={styles.listWrapHeader}>
                <select 
                    className={styles.listSelector}  
                    value={sortType} 
                    onChange={(e) => handleSort(e, e.target.value)}
                >
                    {sortOptions.map((item, i) => 
                        <option key={i} value={item}>{item}</option>
                    )}
                </select>

                <span className={styles.listTitle}>   {title}</span>

            </div>
            <div className={styles.tableWrap}>
                <table>
                    <thead className={styles.listRowHeaders}>
                        <tr>
                            <th><i className="far fa-clock"></i></th>
                            <th><i className="fas fa-heart"></i></th>
                            <th><i className="fas fa-grip-lines"></i></th>
                            <th><i className="fas fa-dollar-sign"></i></th>
                            <th><i className="fa fa-times" aria-hidden="true"></i></th>
                        </tr>
                    </thead>
                    <tbody className={styles.listRowWrap}>  
                        {filteredData.map((item, i) => 
                            <tr key={i} className={styles.listItemRow} onClick={ (e) => displayCard(e, item)}>
                                <td>{item.date}</td>
                                <td>{item.name} </td>
                                <td> {item.category} </td>
                                <td> ${item.estimatedValue} </td>
                                <td className={styles.deleteButton}>
                                    <button 
                                        className={styles.deleteButton} 
                                        value={item._id } 
                                        onClick={(event) => onDeleteItem(event.target.value)}
                                    >
                                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className={styles.totalPickupWrap}>
                <span className={styles.totalPickup}>
                    Items up for Donation: {filteredData.length}
                </span>
            </div>
        </div>

    )
}

export default DonatedList;