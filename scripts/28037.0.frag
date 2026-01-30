#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 50.*( gl_FragCoord.xy / resolution.xy );
	
	float t = time*1.0;
	float r= 0.5*(sin( p.x +t)+1.0);
	float g= 0.5*(sin( p.y +t)+1.0);

	gl_FragColor = vec4( vec3( r, g, 0.0), 1.0 );

}