#ifdef GL_ES
precision mediump float;
#endif

// please always initialize variables, including gl_FragColor!! PS I'm going to puke from this


uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.yx - resolution.x / 5.0;
	float t = 0.4  + length(p) / 170. * sin( 0.4);
	
	
	gl_FragColor = vec4(0.7,0.5,0.2,0.1);
	
	
}