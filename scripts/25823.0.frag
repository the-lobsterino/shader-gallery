#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.5);
	float color = (abs(pos.y*2.1-(sin(pos.x*10.0+time*3.0)+sin(pos.x*2.0+time*2.0)+sin(pos.x*30.0+time*2.1))*0.33)<0.01?1.0:0.0);
	color += (pow(sin(pos.x*150.0),200.0)+pow(sin(pos.y*150.0*resolution.y/resolution.x),200.0))*0.1;
	gl_FragColor = vec4( vec3( 0, color+0.1, 0), 1.0 );
}