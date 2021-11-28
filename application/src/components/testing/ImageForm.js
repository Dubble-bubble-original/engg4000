// This component is for testing only

// React
import { useState } from 'react';

// API
import { postImage, getImage, getImageUrl, deleteImage } from '../../api/api';

function ImageForm() {
    const [file, setFile] = useState();
    const [image, setImage] = useState(null);

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

        setImage([result.id]);
    }

    return (
        <div>
            <form encType='multipart/form-data' onSubmit={submit}>
                <input onChange={fileSelected} type="file" accept="image/*"></input>
                <button type="submit">Upload</button>
            </form>
            <br />
            <button onClick={() => deleteImage(image)}>Delete Image</button>
            <br />
            <button onClick={() => getImageUrl(image)}>Get Image Url</button>
            <br />
            <button onClick={() => getImage(image)}>Get Image</button>
        </div>
    );
}

export default ImageForm;