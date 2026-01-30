#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 squareSize = vec2(0.1, 0.1);
  
  // Set the square position to a random location
  vec2 squarePos = vec2(fract(sin(u_time * 234.5) * 654.3), 
                        fract(sin(u_time * 423.7) * 876.5));
  
  // Apply a sine wave to the x position to create a wobbling effect
  squarePos.x += sin(u_time * 5.0) * 0.05;
  
  // Create a mask for the square by checking if the current pixel is within the square bounds
  vec2 mask = step(squarePos, st) - step(squarePos + squareSize, st);
  
  // Output the mask as the red channel of the final color
  gl_FragColor = vec4(mask, 0.0, 1.0);
}
