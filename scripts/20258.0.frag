precision highp float;

uniform float time;
varying vec2 surfacePosition;

float rand(vec2 co){
  return abs(fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 137.5453)); //0 to 1
}
float makeBall(vec2 v) {
  return 1.0 - 2.0 * length(fract(v) - 0.5);
}
void main (void) {
	//make many squares
	vec2 v = surfacePosition*10.0;
	// make squares
	float val = rand(floor(v));
	val = fract(val + time);
	// Reduce brightness in pixels away from the square center
	val *= makeBall(v);
	val *= makeBall(v*2.0);
	val *= makeBall(v*4.0);
	val *= 8.0;
	gl_FragColor = vec4(val, 0.0, 0.0, 1.0);
}