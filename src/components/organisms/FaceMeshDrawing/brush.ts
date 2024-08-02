interface Landmark {
    x: number;
    y: number;
}
interface DrawingOptions {
    color: string;
    radius: number;
    fillColor:string;
}


const drawSpecificLandmarks = (
    canvasCtx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    indices: number[],
    options: DrawingOptions
) => {
    indices.forEach(index => {
        const point = landmarks[index];
        canvasCtx.beginPath();
        canvasCtx.arc(point.x * canvasCtx.canvas.width, point.y * canvasCtx.canvas.height, options.radius, 0, 2 * Math.PI);
        canvasCtx.fillStyle = options.color;
        canvasCtx.fill();
    });
};


const drawAndFillLoop = (
    canvasCtx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    indices: number[],
    options: DrawingOptions
) => {
    if (indices.length < 4) {
        console.error("Need at least four points to form a smooth closed loop with curves");
        return;
    }

    // Create an offscreen canvas for the blurred fill
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvasCtx.canvas.width;
    offscreenCanvas.height = canvasCtx.canvas.height;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    
    if (!offscreenCtx) {
        console.error('Failed to get offscreen canvas context');
        return;
    }

    // Draw and fill the shape on the offscreen canvas
    offscreenCtx.beginPath();

    // Move to the first point
    const startIndex = indices[0];
    offscreenCtx.moveTo(
        landmarks[startIndex].x * offscreenCanvas.width,
        landmarks[startIndex].y * offscreenCanvas.height
    );

    // Draw bezier curves between all points
    for (let i = 0; i < indices.length; i++) {
        const current = landmarks[indices[i]];
        const next = landmarks[indices[(i + 1) % indices.length]];
        const nextNext = landmarks[indices[(i + 2) % indices.length]];
        const prev = landmarks[indices[(i - 1 + indices.length) % indices.length]];

        // Control points
        const cp1 = {
            x: current.x * offscreenCanvas.width + (next.x - prev.x) * offscreenCanvas.width * 0.25,
            y: current.y * offscreenCanvas.height + (next.y - prev.y) * offscreenCanvas.height * 0.25
        };
        const cp2 = {
            x: next.x * offscreenCanvas.width - (nextNext.x - current.x) * offscreenCanvas.width * 0.25,
            y: next.y * offscreenCanvas.height - (nextNext.y - current.y) * offscreenCanvas.height * 0.25
        };

        offscreenCtx.bezierCurveTo(
            cp1.x, cp1.y,
            cp2.x, cp2.y,
            next.x * offscreenCanvas.width, next.y * offscreenCanvas.height
        );
    }

    // Close the path and fill it
    offscreenCtx.closePath();
    offscreenCtx.fillStyle = options.fillColor;
    offscreenCtx.fill();

    // Apply blur effect to the offscreen canvas
    offscreenCtx.filter = 'blur(5px)'; // Adjust the blur radius as needed

    // Draw the blurred fill onto the main canvas
    canvasCtx.drawImage(offscreenCanvas, 0, 0);

    // Optionally draw the outline on the main canvas
    canvasCtx.beginPath();
    canvasCtx.moveTo(
        landmarks[startIndex].x * canvasCtx.canvas.width,
        landmarks[startIndex].y * canvasCtx.canvas.height
    );
    for (let i = 0; i < indices.length; i++) {
        const current = landmarks[indices[i]];
        const next = landmarks[indices[(i + 1) % indices.length]];
        const nextNext = landmarks[indices[(i + 2) % indices.length]];
        const prev = landmarks[indices[(i - 1 + indices.length) % indices.length]];

        const cp1 = {
            x: current.x * canvasCtx.canvas.width + (next.x - prev.x) * canvasCtx.canvas.width * 0.25,
            y: current.y * canvasCtx.canvas.height + (next.y - prev.y) * canvasCtx.canvas.height * 0.25
        };
        const cp2 = {
            x: next.x * canvasCtx.canvas.width - (nextNext.x - current.x) * canvasCtx.canvas.width * 0.25,
            y: next.y * canvasCtx.canvas.height - (nextNext.y - current.y) * canvasCtx.canvas.height * 0.25
        };

        canvasCtx.bezierCurveTo(
            cp1.x, cp1.y,
            cp2.x, cp2.y,
            next.x * canvasCtx.canvas.width, next.y * canvasCtx.canvas.height
        );
    }
    canvasCtx.closePath();
    // canvasCtx.strokeStyle = options.color;
    // canvasCtx.stroke();
};

const drawImageAtIndex = (
    canvasCtx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    index: number,
    image: HTMLImageElement
) => {
    // Get the coordinates for the specific index
    const landmark = landmarks[index];
    const x = landmark.x * canvasCtx.canvas.width;
    const y = landmark.y * canvasCtx.canvas.height;
    //console.log("Got image width=",image.width)
    //image.setAttribute('opacity','0.5');
    canvasCtx.globalAlpha = 0.25;
    canvasCtx.drawImage(image, x - 10, y - 10, 75, 75);
    
    // const dotRadius = 3; // Radius of the dot
    // const dotColor = 'rgba(0, 255, 0, 1)'
    // canvasCtx.fillStyle = dotColor;
    // canvasCtx.beginPath();
    // canvasCtx.arc(x, y, dotRadius, 0, Math.PI * 2, true); // Draw a complete circle
    // canvasCtx.fill();
    // // Create a new Image object
    // const img = new Image();
    // img.src = imageUrl;

    // img.onload = () => {


    //     // Draw the image on the canvas
    //     canvasCtx.drawImage(img, x, y, img.width, img.height);
    // };

    // img.onerror = (error) => {
    //     console.error("Error loading image:", error);
    // };
};

export default drawAndFillLoop;
export {drawImageAtIndex};
