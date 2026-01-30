#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	vec2 origo = vec2(mouse.x, mouse.y);
	float dist = distance(origo, pos);
	
	vec3 col = vec3(dist, dist / 10.0, 1.0 - dist);
	gl_FragColor = vec4( col, 1.0 );

}