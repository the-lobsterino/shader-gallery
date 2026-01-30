#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//channel not found

#define time time+cos(time*4. + gl_FragCoord.x / 60. + gl_FragCoord.y/50.)+cos(time*3. + sin(gl_FragCoord.x / 60. + time * 2.) + gl_FragCoord.y/20.)
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy + time * resolution);

	float color = 0.0;
	color += floor(sin( position.x * 70. + time * 4.) * 2.);

	gl_FragColor = vec4( vec3( color, color, color ), 1.0 );
	
	
	
	
}