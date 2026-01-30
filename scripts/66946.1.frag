// -sys 3
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float u_time;
void main( void ) {
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	float f = abs(p.x)+sin(floor(p.x*32.0))+cos(floor(p.y*32.))*.8*sin(time)*2.;
	
	
	gl_FragColor = vec4(f,f,1,1);
	

}