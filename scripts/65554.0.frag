// 170620N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
const float ZOOM = 20.0;
const float SPEED = 80.0;
const int TIMES = 4;

void main( void ) {

	vec2 pos = gl_FragCoord.xy / ZOOM;
	pos.x += sin(pos.y+time) + cos(pos.y+time);
	
	float dist;

	for (int i =0; i < TIMES; i++) {
	dist = distance(pos.x, pos.y);
	pos.x = pos.x + cos (pos.y + sin(dist)) + sin (time/SPEED);
	pos.y = pos.y - sin (pos.x - sin(dist)) - cos (time/SPEED);
	}
	
	gl_FragColor = vec4(sin (pos. x *1.2), sin (pos. x * 0.1), sin (pos. x *0.1), 1.0 );

}