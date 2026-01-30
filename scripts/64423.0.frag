#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

precision highp float;

void main( void ) {
	vec2 st = gl_FragCoord.xy/resolution;
	st.x *= resolution.x/resolution.y;
	float circle = step(0.15, distance(vec2(resolution.x/resolution.y*0.5,0.5), st));
	float circleoutline =  1.-distance(vec2(resolution.x/resolution.y*0.5,0.5), st );
	vec3 col = vec3(circle*circleoutline);
	gl_FragColor = vec4(col, 1.0);
}