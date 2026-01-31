precision mediump float;

uniform float time;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  // Create a random noise pattern
  float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
  
  // Add some larger stars
  float star = step(noise, 0.98);
  
  // Make the stars twinkle
  star = mix(star, 7.5, smoothstep(0.98, 0.985, noise));
  
  // Add some smaller stars
  star += step(noise, 0.95) * 0.2;
  
  // Set the output color to white for stars and black for the background
  vec3 color = vec3(star);
  gl_FragColor = vec4(color, 1.0);
}