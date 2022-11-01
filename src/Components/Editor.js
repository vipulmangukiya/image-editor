import React, { useState } from 'react';
import { Form, Button, Card, ButtonToolbar, ButtonGroup, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FileUpload from './FileUpload';
import CanvasDisplay from './CanvasDisplay';
import { downloadPng, drawTransparentImageFromWebUrl, drawBgColorImageFromWebUrl } from './../util';

function Editor(props) {
    const [uploadFile, setUploadFile] = useState(null);
    const [hexCode, setHexCode] = useState('');
    const [hasPickupColor, setHasPickupColor] = useState(false);
    const [canvasTag, setCanvasTag] = useState(null);

    const toogleHasPickupColor = () => {
        setHasPickupColor((bool) => !bool);
    }

    return (
        <main className="App-header">
            <Card>
                <Card.Body>
                    <ButtonToolbar
                        className="justify-content-between"
                        aria-label="Action buttons"
                    >
                        <ButtonGroup aria-label="Left Side Buttons">
                            <FileUpload handleFile={setUploadFile} />{' '}
                            {uploadFile ?
                                <>
                                    <Button variant="dark" onClick={() => setUploadFile(null)} title="click to close file">
                                        <FontAwesomeIcon icon={['fas', 'fa-xmark']} />
                                    </Button>
                                    <Button variant="secondary" onClick={() => drawTransparentImageFromWebUrl(canvasTag, uploadFile.src)} title="click to set background transparent">
                                        <FontAwesomeIcon icon={['fas', 'fa-images']} />
                                    </Button>
                                    <Button variant="info" onClick={() => downloadPng(canvasTag, uploadFile.file)} title="click to download PNG">
                                        <FontAwesomeIcon icon={['fas', 'fa-download']} />
                                    </Button>
                                </>
                                : <></>}

                        </ButtonGroup>
                        {uploadFile ?
                            <InputGroup>
                                <Button variant={hasPickupColor ? "secondary" : "dark"}
                                    onClick={toogleHasPickupColor} title="click to pickup color from image">
                                    <FontAwesomeIcon icon={['fas', 'eye-dropper']} />
                                </Button>
                                <Form.Control
                                    type="text"
                                    placeholder="Color Hex Code"
                                    aria-label="Color Hex Code"
                                    aria-describedby="btnGroupAddon2"
                                    readOnly={hasPickupColor}
                                    value={hexCode ?? '#ffffff'}
                                    onChange={(e) => setHexCode(e.target.value)}
                                />
                                <InputGroup.Text id="basic-addon2" style={{ color: hexCode ?? '#ffffff' }}>
                                    <FontAwesomeIcon icon={['fas', 'fa-square']} />
                                </InputGroup.Text>
                                <Button onClick={() => drawBgColorImageFromWebUrl(canvasTag, uploadFile.src, hexCode)} title="click to apply background color">Apply</Button>
                            </InputGroup> : <></>}
                    </ButtonToolbar>
                </Card.Body>
                <CanvasDisplay
                    file={uploadFile}
                    setHexCode={setHexCode}
                    hasPickupColor={hasPickupColor}
                    setCanvas={setCanvasTag}
                />
            </Card>
        </main>
    )
}

export default Editor;