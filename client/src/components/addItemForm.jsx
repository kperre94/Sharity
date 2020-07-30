import React, { useState } from 'react';
import styles from '../styles/AddItemForm.css';
import axios from 'axios';

const NewItem = (props) => {
    const [itemName, onItemNameChange] = useState('')
    const [category, onCatChange] = useState('')
    const [zipcode, onZipChange] = useState('')
    const [condition, onConditionChange] = useState('')
    const [description, onDescChange] = useState('')
    const [image, onImageChange] = useState('')
    const [estVal, onValChange] = useState('')
    const date = new Date();



    function onImageAdd() {
        //add image
    }

    console.log(props);
    function onDonateSubmit() {
        if(!localStorage.getItem('user')) {
            return;
        }
        const userData = JSON.parse(localStorage.getItem('user'))
        const userName = userData.name
        const email = userData.email
        console.log(userName, email)
        var data = {
            donor: userName,
            name: itemName,
            Description: description,
            pictures: image,
            estimatedValue: estVal || 0,
            itemCondition: condition || 'test',
            Location: zipcode,
            dateCreated: date,
            category: category,
            email: email
        };

        axios.post('/items', data)
        .then(res=> {
            console.log('your item has been added', res.data)
        })
        .catch(err => {
            console.log('error posting on axios post request: ', err)
        })
    }

    return (
        <div className={styles.addItemFormWrapper}>
            <div className={styles.addedItemImageWrapper}>
                <img className={styles.addedItemImage} src={image}></img>
            </div>

            <div className={styles.inputFieldWrapper}>

                <input
                    className={styles.addNameInputField}
                    value={itemName}
                    onChange={(event) => onItemNameChange(event.target.value)}
                    placeholder="item name"
                    type="text"
                    required
                ></input>
                <input
                    className={styles.addCategoryInputField}
                    value={category}
                    onChange={(event) => onCatChange(event.target.value)}
                    placeholder="item category"
                    type="text"
                    required
                ></input>

                <div>

                    <input
                        className={styles.addValueInputField}
                        value={estVal}
                        onChange={(event) => onValChange(event.target.value)}
                        placeholder="estimated Value"
                        type="number"
                        required
                    ></input>
                    <input
                        className={styles.addZipInputField}
                        value={zipcode}
                        onChange={(event) => onZipChange(event.target.value)}
                        placeholder="zipcode"
                        type="number"
                        required
                    ></input>
                </div>
            
                <input
                    className={styles.addDescriptionInputField}
                    value={description}
                    type="text"
                    onChange={(event) => onDescChange(event.target.value)}
                    placeholder="brief description of your item"
                    required
                ></input>
                <select
                    name="condition"
                    value={condition}
                    type="text"
                    defaultValue='default'
                    required
                    onBlur={(event) => onConditionChange(event.target.value)}
                >
                        <option className={styles.conditionOptions} value='default' disabled>condition</option>
                        <option className={styles.conditionOptions} value='test'>New</option>
                        <option className={styles.conditionOptions} value='test'>Excellent</option>
                        <option className={styles.conditionOptions} value='test'>Good</option>
                        <option className={styles.conditionOptions} value='test'>Rough</option>
                        <option className={styles.conditionOptions} value='test'>Should go in the trash</option>
                </select >

                <input
                    value={description}
                    type="text"
                    onChange={(event) => onDescChange(event.target.value)}
                    placeholder="brief description of your item"
                    required
                ></input>
                <button
                    className={styles.addItemSubmitButton}
                    onClick={() => onDonateSubmit()}
                    onClick={() => props.closeModal()}
                >
                    Submit Donation Item
                </button>
            </div>
        </div>

    )
}

export default NewItem;