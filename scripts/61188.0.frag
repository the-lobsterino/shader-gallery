#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy/ resolution.xy)-.5;
	float color = 0.;
	uv *= 20.;
	
	vec2 st = vec2(length(uv), atan(uv.x, uv.y));
	color = st.y;
	
	
	float stripe = smoothstep(0.,0.1,fract(pow(st.x*10.,.75) + st.y/6.28-time*1.));
	
	color = stripe;
	color = time-1580.;
		
	gl_FragColor = vec4( vec3(color), 1.0 );

}