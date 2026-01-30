#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float dist(float dx, float dy) {
	return sqrt(dx*dx + dy*dy);
}


void main( void ) {
	int bin_size = 10;
	int x_round = int(gl_FragCoord.x / float(bin_size)) * bin_size;
	int y_round = int(gl_FragCoord.y / float(bin_size)) * bin_size;
	
	float x = float(x_round)/resolution.x;
	float y = float(y_round)/resolution.y;
	
	float dx = gl_FragCoord.x - float(x_round + bin_size/2);
	float dy = gl_FragCoord.y - float(y_round + bin_size/2);
	
	float d = dist(dx, dy);
	if (d < float(bin_size/2)) {
		gl_FragColor = vec4(x * 0.9, (1.0-y) * 0.9, 0.9, 1.0);
	} else {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
	//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}