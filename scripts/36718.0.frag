#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy*1.0-resolution)/min(resolution.x,resolution.y);
	float ratio = resolution.x/resolution.y;
	
		p += vec2(cos(-time/3.0)*ratio,sin(-time/3.0)*1.7+1.0);
		float l = 0.1/length(p);
	
	gl_FragColor = vec4(vec3(l),1.0);
}