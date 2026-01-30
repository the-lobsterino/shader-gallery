#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
const float ZOOM = 80.0;
const float SPEED = 10.0;
const int TIMES = 9;

void main( void ) {

	vec2 pos = gl_FragCoord.xy / ZOOM;
	
	float dist;

	for (int i =0; i < TIMES; i++) {
	dist = distance(pos.x, pos.y);
	pos.x = pos.x + cos (pos.y + sin(dist)) + sin (time/SPEED);
	pos.y = pos.y - sin (pos.x - sin(dist)) - cos (time/SPEED);
	}
	
	gl_FragColor = vec4(sin (pos. x *0.2), sin (pos. x * 0.1), sin (pos. x *0.6), 1.0 );

}