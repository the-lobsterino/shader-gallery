#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float sin01(float x){
  return (sin(x)+1.)/2.;
}

void main( void ) {
	
	float square_size_halved = sin01(time) * min(resolution.x, resolution.y) * .5;

	vec2 middle = resolution / 2.;
	
	vec3 rgb = vec3(0.);
	
	if (gl_FragCoord.x > middle.x - square_size_halved && 
	    gl_FragCoord.x < middle.x + square_size_halved &&
	    gl_FragCoord.y > middle.y - square_size_halved &&
	    gl_FragCoord.y < middle.y + square_size_halved) {
		rgb = vec3(sin01(time + 2.), sin01(time + 4.), sin01(time));
	}

	
	gl_FragColor = vec4(rgb, 1.);
}