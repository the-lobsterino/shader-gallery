#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 st =1.* gl_FragCoord.xy/resolution.xy*2.-1.;
vec2 center=vec2(.0);
	st.y*=resolution.y/resolution.x;
//st.y*=-1.;
	float shape = 
	    abs(
	        (st.x - center.x) * (st.x - center.x) 
	      + (st.y - center.y) * (st.y - center.y) 
	      - 0.99
	    )
	      * 16.0;
	vec4 backgroundColor = vec4(st.y,st.y,st.y,1.0);
	vec4 shapeColor = vec4(0.,0.,1.*10.*st.y,1.0);
	gl_FragColor =backgroundColor + shape * shapeColor;
	
	
}
