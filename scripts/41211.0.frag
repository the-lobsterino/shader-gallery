#ifdef GL_ES
precision mediump float;
#endif
 
//#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
void main( void ) {
 
	vec2 position = ( gl_FragCoord.xy * 2.0 -  resolution) / min(resolution.x, resolution.y);
	vec3 destColor = vec3(0.0);
	destColor += 0.2 / abs( ( length( position ) - 0.5 ) ) * ( 0.5 + abs( sin( time ) ) / 2.0 );
	

	if ( length( position - vec2(0.0) ) < 0.58 ) destColor = vec3(1.0);
	if ( length( position - vec2(0.0, -0.15) ) < 0.25 * ( 0.5 + abs( sin( time ) ) / 2.0 )) destColor = vec3(0.7);
	if ( length( position - vec2(0.0, -0.095) ) < 0.26* ( 0.5 + abs( sin( time ) ) / 2.0 ) ) destColor = vec3(1.0);
	if ( length( position - vec2(-0.28, 0.15) ) < 0.08 * ( 0.5 + abs( sin( time ) ) / 2.0 )) destColor = vec3(0.7);
	if ( length( position - vec2(0.28, 0.15) ) < 0.08 * ( 0.5 + abs( sin( time ) ) / 2.0 )) destColor = vec3(0.7);
	
	gl_FragColor = vec4(0.0, destColor.g,0.0, 1.0);
}
