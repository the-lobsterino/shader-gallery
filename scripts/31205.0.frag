#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	
	float t = time * 0.7;

	
	bool b1 = mod(time + 0.1 * cos(time * 220.0) , 2.0) < 0.15;
	bool b2 = mod(time + 0.1 * cos(time * 230.0) , 2.0) < 0.2;
	
	if (b2){ uv.x += 0.01; uv.y += cos(time * 10.0) * 0.01;}
	
	float w =  floor(mod( uv.x / exp(abs(uv.y)) + t , 0.5) * 142.0) * abs(uv.y * 110.0) * 0.06;
	w = step(w, 0.5);
	
	
	if (b1){ w = 0.5 - w * 15.5;}
	w += abs(uv.x);
	w += mod(uv.x, 0.1);
	
	gl_FragColor = vec4(0.2 + fract(time), 0.4, 0.7, 1.0) * w + step(sin(time * cos(time * 2.2)), 0.1) * ( 1.0 + cos(time)) * mod(uv.y, 0.1);
}