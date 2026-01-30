// http://glslsandbox.com/e#42836.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


void main(void) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	 
	vec3 c = vec3(0.0);
	
	 
		c.r = cos(8.*time+40.*(0.5*uv.x+uv.y) *1.5);
		
	 

	gl_FragColor = vec4(c.r,0.0,0.1, 1.0);
}