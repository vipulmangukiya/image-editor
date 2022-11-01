import React, { useRef, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { drawImageFromWebUrl, getEventLocation, rgbToHex } from './../util';

function CanvasDisplay({ file, hasPickupColor, setHexCode, setCanvas }) {
    const canvasRef = useRef(null);
    const [cursorPointer, setCursorPointer] = useState({ x: 0, y: 0 });
    const [currentHex, setCurrentHex] = useState(null);
    const getHexCodeFromMouseMovement = function (_this, e) {

        var eventLocation = getEventLocation(_this, e);
        var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;

        // Get the data of the pixel according to the location generate by the getEventLocation function
        var context = _this.getContext('2d');
        var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;

        // If transparency on the image
        if ((pixelData[0] === 0) && (pixelData[1] === 0) && (pixelData[2] === 0) && (pixelData[3] === 0)) {
            coord += " (Transparent color detected, cannot be converted to HEX)";
        } else {
            setCursorPointer({
                x: eventLocation.x,
                y: eventLocation.y + 30,
            });
        }


        var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
        return hex;

    }

    const canvasMousemoveHandle = function (e) {
        var hex = getHexCodeFromMouseMovement(this, e);
        setCurrentHex(hex);
    }

    const canvasClickHandle = function (e) {
        var hex = getHexCodeFromMouseMovement(this, e);
        setHexCode(hex);
    }

    useEffect(() => {
        if (file !== null) {
            drawImageFromWebUrl(canvasRef.current, file.src)
            setCanvas(canvasRef.current);
        }
    }, [file]);

    useEffect(() => {
        if (file !== null) {
            if (hasPickupColor) {
                canvasRef.current.addEventListener("mousemove", canvasMousemoveHandle);
                canvasRef.current.addEventListener("click", canvasClickHandle);
            } else {
                canvasRef.current.removeEventListener("mousemove", canvasMousemoveHandle);
                canvasRef.current.removeEventListener("click", canvasClickHandle);
            }
        }
    }, [hasPickupColor])

    const transformStyle = {
        backgroundColor: currentHex,
        transform: `translate3d(${cursorPointer.x}px,${cursorPointer.y}px,0px)`,
    }

    return (
        <>
            {file === null ? <Card.Img src="/img/image-holder.png" ></Card.Img>
                : <canvas ref={canvasRef} width="700" height="700" className='canvas-body'></canvas>}
            {hasPickupColor ? <div className='circle' style={transformStyle}></div> : <></>}
        </>

    )
}

export default CanvasDisplay;