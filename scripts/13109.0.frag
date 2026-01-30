#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	vec2 uPos = ( gl_FragCoord.xy / resolution.xy );
	uPos.y += sin( uPos.x * 8. + time ) * .35 - .5;
	gl_FragColor = vec4(  uPos.y * 2. , uPos.y * 1., uPos.y * 3., 0.);
}