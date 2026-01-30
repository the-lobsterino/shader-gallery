#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PHI floor(time*6.0)/(1.00001/sqrt(1.0))

float hash(float x)
{
	return pow(mod(mod(x, PHI)*x, 1.),mod(x,log2(PHI)));	
}
float bash(float x)
{
	x = cos(x)*(time/PHI);
	return pow(mod(mod(x, PHI)*x, 0.5),mod(x,log(PHI)));	
}
float cash(float x)
{
	x = step(cos(x),sin(x));
	return pow(mod(mod(x, PHI)*x, 1.),mod(x,log2(PHI)*x));	
}
float stash(float x)
{
	x = smoothstep(sin(x),sin(x+0.1),(x*time));
	return pow(mod(mod(x, PHI)*time, -1.),mod(PHI,fract(exp(x))));	
}


mat2 rot(float angle){
    return mat2(cos(angle),-sin(angle),
               sin(angle),-cos(angle));
}
void main( void ) {

	float c1 = 1.0-hash(gl_FragCoord.x+stash(gl_FragCoord.y));
	float c2 = 1.0-bash(gl_FragCoord.x+hash(gl_FragCoord.y)); 
	float c3 = 1.0-stash(gl_FragCoord.x+cash(gl_FragCoord.y)); 
	
	vec3 col = vec3(c1,c2,c3);
	
	     col.xy *= rot(time/PHI);
	     col.xz *= rot(time/col.y);
	     col.yz *= rot(time/col.x);
	
	gl_FragColor = vec4(vec3(col),1.0);
	
	
}