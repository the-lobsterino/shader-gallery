#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926



void main( void ) {

	vec2 a = resolution.xy / min(resolution.x, resolution.y);
	vec2 p = ( gl_FragCoord.xy / resolution.xy )*a;
	
	float ttime =  360.+sin(floor(time+fract(time)*0.2));
	gl_FragColor = vec4( 
		mod(p.y*32.00 + ttime*8.,1.0)+min(sin(ttime*1.0),0.5), 
		mod(p.y*32.00 + ttime*8.,1.0)+min(sin(ttime*2.0),0.3),
		mod(p.y*32.00 + ttime*8.,1.0)+min(sin(ttime*3.0),0.2),1.)*vec4(
		
		mod(p.x*32.00 + ttime*8.,1.0)+min(sin(ttime*3.0),0.2), 
		mod(p.x*32.00 + ttime*8.,1.0)+min(sin(ttime*2.0),0.5),
		mod(p.x*32.00 + ttime*8.,1.0)+min(sin(ttime*1.0),0.8),1.)
		
		
		;

}