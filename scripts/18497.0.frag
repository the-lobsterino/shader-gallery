#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool circle(vec2 p, float r, vec2 c) {
	if (distance(p, c) < r) {
		return true;
	}

	return false;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy ;
	
	position *= resolution.x / resolution.y;

	
	if (circle(vec2(0.5), 0.1, position)) {
	  gl_FragColor = vec4(1.0);
	}
	else {
	  gl_FragColor = vec4(0.0);
	}


}