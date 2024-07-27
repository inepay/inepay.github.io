import { TRIANGULATION } from './bigArr';

const drawLipsOutline = (keypoints: any[], ctx: CanvasRenderingContext2D): void => {
  // Define the indices for the lips keypoints
  const lipsIndices = [
    61,  146, 91, 181, 84, 17, 314, 405, 291, 375, 321, 375, 305, 290, 304, 296, 291, 281, 280
  ];

  // Extract the lips keypoints
  const lipsKeypoints = lipsIndices.map(index => keypoints[index]);

  if (lipsKeypoints.length === 0) {
    console.error('No lips keypoints found.');
    return;
  }

  // Draw Lips Outline
  ctx.beginPath();
  ctx.moveTo(lipsKeypoints[0].x, lipsKeypoints[0].y);

  for (let i = 1; i < lipsKeypoints.length; i++) {
    ctx.lineTo(lipsKeypoints[i].x, lipsKeypoints[i].y);
  }

  // Close path and draw
  ctx.closePath();
  ctx.strokeStyle = 'red'; // Outline color
  ctx.lineWidth = 2; // Outline thickness
  ctx.stroke();
};



const drawPath = (ctx: CanvasRenderingContext2D, points: [number, number][], closePath: boolean): void => {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.strokeStyle = 'grey';
  ctx.stroke(region);
};

export const drawMesh = (predictions: any[], ctx: CanvasRenderingContext2D): void => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const keypoints: number[][] = prediction.scaledMesh;

      // Draw Triangles
      for (let i = 0; i < TRIANGULATION.length / 3; i++) {
        const trianglePoints = [
          TRIANGULATION[i * 3],
          TRIANGULATION[i * 3 + 1],
          TRIANGULATION[i * 3 + 2],
        ].map((index) => keypoints[index]);
        // Convert trianglePoints to the expected type
        const points: [number, number][] = trianglePoints.map(point => [point[0], point[1]]);
        drawPath(ctx, points, true);

        // Add shading based on z-coordinate
        const zAvg = (trianglePoints[0][2] + trianglePoints[1][2] + trianglePoints[2][2]) / 3;
        const shading = 1 - zAvg / 200; // Adjust this value based on the average z coordinate
        ctx.fillStyle = `rgba(173, 216, 230, ${shading})`; // Light blue with variable opacity
        ctx.fill();
      }

      // Draw Dots with shading
      for (let i = 0; i < keypoints.length; i++) {
        const x = keypoints[i][0];
        const y = keypoints[i][1];
        const z = keypoints[i][2];

        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 3 * Math.PI);
        ctx.fillStyle = `rgba(0, 255, 255, ${1 - z / 200})`; // Aqua with variable opacity
        ctx.fill();

        // Draw Lips Outline
        drawLipsOutline(keypoints, ctx);
      }
    });
  }
};
