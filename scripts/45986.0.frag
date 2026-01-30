#ifdef GL_ES
precision lowp float;
#endif

uniform float time;

float rand(vec2 co){
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main (void) {
	// Divide the coordinates into a grid of squares
	vec2 v = gl_FragCoord.xy  / 20.0;
	v -= time + vec2(sin(v.y), cos(v.x));
	// Calculate a pseudo-random brightness value for each square
	float brightness = fract(rand(floor(v)) + time/100.0);
	float hue = fract(rand(floor(v) + 1.) + time/100.0);
	// Reduce brightness in pixels away from the square center
	brightness *= 0.5 - length(fract(v) - vec2(0.5, 0.5));
	gl_FragColor = vec4(brightness * 4.0, hue*brightness*4.0, 0.0, 1.0);
}