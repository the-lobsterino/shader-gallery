
precision mediump float;

uniform float time;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  // Create a random noise pattern
  float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 00.5453+cos(time)/10.);
  
  float noise2 = fract(sin(dot(uv, vec2(10000.9898,0.233))) * 00.753+cos(time)/10.);
  
  
  
  // Add some larger stars
  float star = 1.;
  
  // Make the stars twinkle
  star = mix(star, 0., smoothstep(0.98, 0.99,noise2));
  

  
  // Set the output color to white for stars and black for the background
  vec3 color = vec3(star);
  gl_FragColor = vec4(color, 1.0);
}