#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (gl_FragCoord.yx/resolution.yx) - 0.5;
	
	float px = 0.2 * (position.x+0.8)*sin(900.0*position.x-20.0*pow(time, 0.55)*5.0);
	float py = 4.0 / (500.0 * abs(position.y - px));
	
	py += 1./length(25.*length(position - vec2(0, position.y)));
	
	py += 1./length(25.*length(position - vec2(position.x, 0)));
	
	gl_FragColor = vec4((position.x + 0.1) * py, 0.3 * py, py, 1.0);
	
}