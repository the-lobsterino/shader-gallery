//The return of kirby creator !!! 


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
const float ZOOM = 80.0;
const float SPEED = 40.0;
const int TIMES = 8;

void main( void ) {

	vec2 pos = gl_FragCoord.xy / ZOOM;
	
	float dist;
	
	
	for(int i =0; i < TIMES; i++ ) {
		dist = distance(pos.x, pos.y);
		pos.x = pos.x + sin(pos.y + sin(dist)) + sin(time / SPEED);
		pos.y = pos.y - sin(pos.x - sin(dist)) - cos(time / SPEED);
	}
	
	gl_FragColor = vec4(cos(pos.x * 0.4), sin(pos.y *0.8), sin(pos.x *0.8), 1.0);

}