#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 st = gl_FragCoord.xy/min(resolution.x,resolution.y);
	vec2 center = resolution/(min(resolution.x,resolution.y)*2.0);
	float shape = 
	    abs(
	        (st.x - center.x) * (st.x - center.x) 
	      + (st.y - center.y) * (st.y - center.y) 
	      - 0.1
	    )
	      * 5.0;
	vec4 backgroundColor = vec4(st.x,st.y,sin(time),1.0);
	vec4 shapeColor = vec4(st.x,sin(time),st.y,1.0);
	gl_FragColor =backgroundColor + shape * shapeColor;
	
	
}
