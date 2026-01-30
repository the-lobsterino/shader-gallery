//020720N + math

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define c_conj(a) vec2(a.x, -a.y)
#define c_exp(a) vec2(exp(a.x)*cos(a.y), exp(a.x)*sin(a.y))
#define c_sqr(a) vec2(a.x*a.x-a.y*a.y, 2.*a.x*a.y)
#define c_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
#define c_div(a, b) vec2((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y), (a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y))
#define c_cartToPolar(a) vec2(length(a), atan(a.y, a.x))
#define c_polarToCart(a) a.x * vec2(cos(a.y), sin(a.y))

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

	uv = c_sqr(uv); 
	uv = c_sqr(uv); 
	uv = c_sqr(uv); 
	//uv = c_sqr(-uv); 
	uv = c_exp(uv);
	uv = c_polarToCart(uv);
	
    	gl_FragColor = vec4(uv, 0.0, 1.0);
}