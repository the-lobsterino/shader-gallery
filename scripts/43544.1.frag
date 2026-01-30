#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

vec2 get_star(float t) {
	float w = floor(t*4.);
	
	float x = 10.*sin(3.5*w);
	float y = 10.*cos(w);
	float z = 10.*(w/4.-time*3.0+5.);
	
	return vec2(x/z, y/z);	
}

void main( void ) {
	
	vec2 pos = 2.0*gl_FragCoord.xy/resolution.y - vec2(16.0/9.0, 1);
vec4 c = vec4(0.0);
	for(float i = 0.; i < 5.; i += .1) {
		if(length(pos-get_star(time*3.0-i)) < (i+1.)*.002) 
			c = vec4(1, 1, 1, 1);
	}
	gl_FragColor = mix(c * 10.0, texture2D(bb, gl_FragCoord.xy/resolution.xy), 0.9);
}