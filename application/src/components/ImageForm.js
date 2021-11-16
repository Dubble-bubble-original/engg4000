// React
import { useState } from 'react';
import axios from 'axios'

// Get environment
require('dotenv').config();
const ENV = process.env;

// Get the service url from the environment file
const serviceUrl = ENV.REACT_APP_SERVICE_URL;

async function postImage(file) {
    console.log(file);

    const formData = new FormData();
    formData.append('image', file);

    for (let key of formData.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }

    const result = await axios({
        method: 'POST',
        url: serviceUrl + '/image',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    });

    console.log(result);
    return result.data
}

// async function getImage(id) {
//     const result = await axios({
//         method: 'GET',
//         url: serviceUrl + '/image/' + id
//     });

//     return result.data
// }

function ImageForm() {
    const [file, setFile] = useState()
    const [images, setImages] = useState([])

    const fileSelected = event => {
        const file = event.target.files[0];
        setFile(file);
    }

    const submit = async event => {
        console.log('File:');
        console.log(file);
        event.preventDefault();
        const result = await postImage(file);
        console.log('result:');
        console.log(result);

        // let imageData = await getImage(result.id);
        setImages([result.id, ...images]);
    }

    return (
        <div>
            <form encType='multipart/form-data' onSubmit={submit}>
                <input onChange={fileSelected} type="file" accept="image/*"></input>
                <button type="submit">Upload</button>
            </form>

            {images.map(image => (
                <div key={image}>
                    <img style={{maxHeight: '200px'}} src={serviceUrl + '/image/' + image} ></img>
                </div>
            ))}
        </div>
    );
}

export default ImageForm;