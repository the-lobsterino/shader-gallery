#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;


void main(void) {
	vec2 st = gl_FragCoord.xy / resolution.xy;


	vec3 color=texture2D(backbuffer,st).rgb;
	
	
	vec2 radius=vec2(16.0)/resolution;
	float nx=1.0/resolution.x;
	float ny=1.0/resolution.y;
	
	int sum = 0;
	if (texture2D(backbuffer,st+vec2(-nx,ny)).r>0.)	sum+=1;
	if (texture2D(backbuffer,st+vec2(0.,ny)).r>0.) 	sum+=1;
	if (texture2D(backbuffer,st+vec2(nx,ny)).r>0.) 	sum+=1;
	if (texture2D(backbuffer,st+vec2(-nx,0.)).r>0.) sum+=1;
	if (texture2D(backbuffer,st+vec2(nx,0.)).r>0.) 	sum+=1;
	if (texture2D(backbuffer,st+vec2(-nx,-ny)).r>0.) sum+=1;
	if (texture2D(backbuffer,st+vec2(0.,-ny)).r>0.) sum+=1;
	if (texture2D(backbuffer,st+vec2(nx,-ny)).r>0.)	sum+=1;
	
	if (sum==3) {
	    color=vec3(st.x,st.y,mod(time,8.5));
	} else if (sum<=1 || sum>3) { 
	    color=vec3(0.0);
	}
	if (distance(mouse,st) < 0.025 && distance(mouse,st) > 0.024) {
		color=vec3(0.5,0.0,0.5);
	}
	
	gl_FragColor = vec4(color, 1.0);
}