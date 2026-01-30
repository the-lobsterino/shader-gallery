#ifdef GL_ES
precision mediump float;
#endif
//the ambreichst ???

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.5);
	position.x *= resolution.x / resolution.y;
	position.y += time*0.2;
	position.x += 0.1*sin(time+position.y*8.) * (mod(gl_FragCoord.y, 2.0) - 1.);

	float color = fract((position.x+position.y)*4.)+fract((position.y-position.x)*71.) * 0.5;

	gl_FragColor = vec4( color, color, color, 1.0 );

}