#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
const float ZOOM = 200.0;
const float SPEED = 3.0;
const int TIMES = 10;

void main( void ) {

	vec2 pos = gl_FragCoord.xy / ZOOM;
	
	float dist;
	
	
	for(int i =0; i < TIMES; i++ ) {
		dist = distance(pos.x, pos.y);
		pos.x = pos.x + cos(pos.y + sin(dist)) + abs(time / SPEED);
		pos.y = pos.y - cos(pos.x - sin(dist)) - cos(time / SPEED) + 0.0;
	}
	
	gl_FragColor = vec4(cos(pos.y * 0.06), sin(pos.y *0.7), sin(pos.x * 0.2), 1.0);

}