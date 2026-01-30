#ifdef GL_ES
precision mediump float;
#endif

uniform float t;
uniform vec2 m;
uniform vec2 r;

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
	float l   = 0.1 / length(p);
	
	gl_FragColor = vec4( vec3( l, l , l ), 1.0 );

}