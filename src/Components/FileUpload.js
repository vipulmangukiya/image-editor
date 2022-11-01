import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function FileUpload(props) {
    const hiddenFileInput = useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    const handleChange = (event) => {
        const [file] = event.target.files;
        const src = URL.createObjectURL(file);
        props.handleFile({ src, file });
    };

    return (
        <>
            <Button variant="success" onClick={handleClick} title="click to upload">
                <FontAwesomeIcon icon={['fas', 'upload']} />
            </Button>
            <input
                ref={hiddenFileInput}
                accept="image/jpeg,image/png"
                type="file"
                name="file"
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </>
    )
}

export default FileUpload;