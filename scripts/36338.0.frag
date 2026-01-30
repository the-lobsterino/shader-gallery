#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) + vec2(0.0)  / 4.0;
	
	uv = floor( uv * 25.0) / 25.0 ;

	vec4 color = vec4(
		abs(sin(cos(time+3.*uv.y)*2.*uv.x+2.*time)),
		abs(cos(sin(time+1.*uv.x)*3.*uv.y+time)),
		4.0 * 100.,
		1.0);

	gl_FragColor = color;

}