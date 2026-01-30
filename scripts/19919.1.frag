#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float _X = gl_FragCoord.x;
	float _Y = gl_FragCoord.y;
	
	float _cos = cos(time * 2.) / 2. + .5;
	
	float _x = gl_FragCoord.x / resolution.x;
	float _y = gl_FragCoord.y / resolution.y;
	
	float _dc = sqrt(pow(_x - .5, 2.) + pow(_y - .5, 2.));
	
	float v  =  (cos(_y * 100. *_dc  + time) / 2. + .5) + (cos((1. -_y) * 1000. *_dc + time) / 2. + .5);
	

	gl_FragColor = vec4(v, v, v, 1);

}