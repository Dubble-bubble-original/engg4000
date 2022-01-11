// This component is for testing only

// React
import { useState } from 'react';

// API
import { postImage, getImage, deleteImage, postImages, post } from '../../api/api';

function ImageForm() {
    const [file, setFile] = useState();
    const [avatarId, setAvatarId] = useState();
    const [pictureId, setPictureId] = useState();
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

    const submitPostImages = async event => {
        console.log('File:');
        console.log(file);

        event.preventDefault();
        const data = await postImages(file, file);
        console.log(data);
        setAvatarId(data.avatarId);
        setPictureId(data.pictureId);
        console.log(avatarId);
        console.log(pictureId);
    }

    const submitPost = async event => {
        console.log('File:');
        console.log(file);

        const user = { name: 'John Doe', email: 'john.doe@mail.com' };
        const userPost = { title: 'Title', body: 'Body.', tags: ['forest'], true_location: false, location: { 'lat': 0, 'lng': 0 }, location_string: 'New Brunswick, Canada' };

        event.preventDefault();
        const result = await post(avatarId, pictureId, user, userPost);
        console.log('result:');
        console.log(result);
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
            <button onClick={() => getImage(image)}>Get Image</button>

            <br/>

            <form encType='multipart/form-data' onSubmit={submitPostImages}>
                <input onChange={fileSelected} type="file" accept="image/*"></input>
                <button type="submit">Upload post images</button>
            </form>

            <br/>

            <button onClick={submitPost}>Create post</button>
        </div>
    );
}

export default ImageForm;