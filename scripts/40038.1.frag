#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float dis = distance(gl_FragCoord.xy, resolution.xy / 2.);
	float color = abs(sin(dis * sin(time * 10. * gl_FragCoord.x)) * dis * cos(time * 10. * gl_FragCoord.y));
	
	gl_FragColor = vec4( vec3( color, color * 0.5, abs(sin( color ))), 1.0 );
}