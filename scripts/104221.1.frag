#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = (gl_FragCoord.xy/ resolution.xy)*2.-1.;
	uv . x *= resolution.x/resolution.y;
	
	vec3 c = vec3(0);
	
	//uv = abs(uv);
	float i = clamp(.5*(uv.y-uv.x+.5),0.,.5);
	c.r += i;
	c.g = length(vec2(uv.x-.5+i,uv.y-i));
	c = mod(c,.1)*10.;
	
	gl_FragColor = vec4(c,1.0);
}