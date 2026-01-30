#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float plot(vec2 st, float pct) {
	return smoothstep(pct-.02, pct, st.y) - smoothstep(pct, pct+.02, st.y);
}

void main( void ) {

	vec2 st = gl_FragCoord.xy / resolution.xy;

	float y = mix(.25, .75, (sin(st.x * 3.14 * 2.0 + time) + 1.)/ 2.);
		
	vec3 color = vec3(1.0);
	
	vec3 color2 = mix(vec3(1.0, .0,.0), vec3(.0,.0,1.0), st.x);
	
	color = mix(color, color2, plot(st, y));
	//color = mix(color, vec3(1.0) - color2, plot(st, y2));
	
	gl_FragColor = vec4(color, 1.0);

}