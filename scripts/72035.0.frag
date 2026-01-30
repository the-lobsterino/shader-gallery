#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926

float plot(vec2 st,float pec){
	return smoothstep(pec - 0.02,pec,st.y) - smoothstep(pec,pec + 0.02,st.y);
}

void main( void ) {
	vec2 st = gl_FragCoord.xy/resolution;
	
	float y = sin(st.x * time);		
	
	
	vec3 color = vec3(1.0);
	float pec = plot(st,y);
	color = color * (1.0 - pec) + pec * vec3(.0,.5,.0);
	gl_FragColor = vec4(color,1.0);
}