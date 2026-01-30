#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 1.0;
	color = 1./distance(vec2(gl_FragCoord),vec2(resolution.xy/2.0))*(resolution.x/100.0);
	float angle = atan((gl_FragCoord.y-(resolution.y/2.0))/(gl_FragCoord.x-resolution.x/2.0));
	gl_FragColor = vec4( vec3( color*abs(cos(sin(angle-time))), color*abs(sin(angle+time)),color*abs(sin(time-angle))), 1.0 );

}