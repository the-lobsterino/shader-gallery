#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy )  - sin(time * 0.3) * 0.1 - 0.5;
	float t = time * 1.5;

	float w =  floor(mod( uv.x / sqrt(abs(uv.y)) + t , 0.5) * 142.0) * abs(uv.y * 110.0) * 0.06;
	w = step(w, 0.5);
	
	
	gl_FragColor = vec4(0.2, 0.4, 0.7, 1.0) * w + step(sin(time * cos(time * 2.2)), 0.1) * ( 1.0 + cos(time)) * mod(uv.y, 0.1);
}