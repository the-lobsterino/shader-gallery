#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;
uniform sampler2D backbuffer;

void main( void ) {
	gl_FragColor = vec4( 1.0 );
	
	const vec2 n = vec2(16,10);
	vec2 uv = gl_FragCoord.xy/resolution;
	
	vec2 mouse = .5+.25*vec2(cos(time), sin(time));
	
	vec2 n_uv = uv - mod(uv, 1./n);
	vec2 n_mo = mouse - mod(mouse, 1./n);
	
	if(distance(n_uv, n_mo) < 1e-3){
		gl_FragColor = vec4(0.);
		return;
	}
	
	vec2 n_mo_inv = (1.-mouse) - mod(1.-mouse, 1./n);
	if(distance(n_uv, n_mo_inv) < 1e-3){
		gl_FragColor = vec4(1);
		return;
	}
	
	vec2 sample_space = mod(uv, 1./n)*n;
	sample_space = vec2(1.-sample_space.y, sample_space.x);
	gl_FragColor = vec4(texture2D(backbuffer, sample_space).a);
	
	gl_FragColor.rgb = mix(gl_FragColor.rgb, texture2D(backbuffer, uv).rgb, 0.95);
}