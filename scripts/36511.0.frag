#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;
uniform sampler2D bb;

void main( void ) {
	gl_FragColor = vec4(0,0,0,1);
	vec2 uv = gl_FragCoord.xy/resolution;
	
	if(mouse.y > 0.9) return;
	
	gl_FragColor = max(gl_FragColor, texture2D(bb, uv));
	
	float mouse_pixel_size = 2.;
	float md = distance(mouse*resolution, gl_FragCoord.xy)/mouse_pixel_size;
	if(md < 1.){
		gl_FragColor = vec4(vec3(1.-md),1);
		return;
	}
	
	vec2 cuv = uv-.5;
	vec2 csp = vec2(length(cuv), atan(cuv.x, cuv.y));
	
	float num_sym_axies = 11.;
	
	//csp.y += fract(time);
	csp.y += 3.14159/num_sym_axies;
	
	vec2 rot_one_point = csp.x*vec2(sin(csp.y), cos(csp.y));
	gl_FragColor = max(gl_FragColor, texture2D(bb, rot_one_point+.5));
	
}