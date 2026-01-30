#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define R length(surfacePosition)
#define TH atan(surfacePosition.x, surfacePosition.y)

vec2 CxyLog(vec2 inp){
	float r = length(inp);
	float th = atan(inp.x, inp.y);
	return vec2(log(r), th);
}
vec2 CxySin(vec2 inp){
	return 0.5*vec2(
		-exp(-inp.y)*cos(inp.x) + exp(inp.y)*cos(-inp.x), 
		exp(-inp.y)*sin(inp.x) - exp(inp.y)*(sin(-inp.x))
	);
}
vec2 CxyPowReal(vec2 inp, float N){
	float r = length(inp);
	float th = atan(inp.x, inp.y);
	return pow(r, N)*vec2(sin(th*N), cos(th*N));
}
vec2 CxyPowImag(vec2 inp, float N){
	float r = length(inp);
	float th = atan(inp.x, inp.y);
	return exp(-N*th)*vec2(sin(log(r)*N), cos(log(r)*N));
}
vec2 CxyMultCxy(vec2 inp, vec2 jnp){
	return vec2(inp.x*jnp.x - inp.y*jnp.y, inp.x*jnp.y + inp.y*jnp.x);
}
vec2 CxyPowCxy(vec2 inp, vec2 jnp){
	return CxyMultCxy(CxyPowReal(inp, jnp.x), CxyPowImag(inp, jnp.y));
}
void main( void ) {

	vec2 p = surfacePosition;
	
	vec2 c = vec2(-1., sin(length(p)+time)/length(p));
	
	vec2 z = CxyPowCxy(c, p);
	
	float re = sin(z.x)*sin(z.x);
	float gr = sin(z.y)*sin(z.y);
	float bl = cos(z.x)*cos(z.y);
	float l = 0.;
	
	gl_FragColor = vec4( re, gr, bl, l );

}