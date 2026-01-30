#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) * 100.0;
	
	float color = mod(pos.y * pos.x, 1.5);
	
	float golor = 1.0/sqrt(pow(pos.x - 40.0 - 4.0*sin(time), 2.0) + pow(pos.y - 40.0 - 5.0*cos(time), 2.0) - 3.0);
	
	golor+= 1.0/sqrt(pow(pos.x - 40.0 - 4.0*sin(time), 2.0) + pow(pos.y - 40.0 - 8.0*cos(time), 2.0) - 10.0);
	golor+= 1.0/sqrt(pow(pos.x - 40.0 - 8.0*sin(time), 2.0) + pow(pos.y - 40.0 - 16.0*cos(time), 2.0) - 20.0);
	golor+= 1.0/sqrt(pow(pos.x - 40.0 - 16.0*sin(time), 2.0) + pow(pos.y - 45.0 - 16.0*cos(3.0*time), 2.0) - 10.0 + 10.0*sin(time));
	gl_FragColor = vec4( color/2.0, golor/2.0, 0.0, 1.0 );

}