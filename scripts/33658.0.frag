#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy);
	gl_FragColor = vec4( cos(sin(p.x*p.y*848278.)) );
}//trp