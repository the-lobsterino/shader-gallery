#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	
  vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
  // Get the current time.
  float t = time * 5.;

  // Generate a random number between 0 and 1.
  float r = fract(sin(t) * 43758.5453123);
  float g = fract(sin(t) * 43758.5453123);
  float b = fract(sin(t) * 43758.5453123);

  // Set the color of the fragment to a random color.
  gl_FragColor = vec4(r, g, b, 1.0);
}