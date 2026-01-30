#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
uniform float time;
uniform vec2 mouse;
uniform vec3 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p  - 1.0;
	p.x *= resolution.x / resolution.y;
	
	float color = max(abs(p.x*2.0), abs(p.y));
	color = step(0.5, color);

	gl_FragColor = vec4( 1,1,0,1 );

}