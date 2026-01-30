// http://glslsandbox.com/e#42836.1
// gtr
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


void main(void) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	 
	vec3 c = vec3(0.0);
	 
	if(length(uv*uv)>0.2+abs(0.8*sin(time*3.))  ) /// :))) square 
	   
	c.r = mod(sin(8.*time+(15.0*(3.5/uv.x/uv.y)*0.2)), 0.0)/
	      mod(cos(8.*time+(15.0*(3.5*uv.x/uv.y)*0.2)), 0.0);
	 

	gl_FragColor  = vec4(c.r,0.,abs(c.r*3.), 1.0)+sqrt(uv.x*uv.x)-pow(uv.y*uv.y,2.0); // forget power, nice now :)
	 
}