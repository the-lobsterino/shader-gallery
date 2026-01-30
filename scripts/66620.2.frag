// max shat
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 p = 1.0 * (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	
	p.x += sin(time+p.y*2.5)*0.2;
	p.y = dot(p,p);
	float len = 0.01 / length(p.x + sin(p.y * 5.0 + time));

	
	float len2 = 0.5 / length(p.x + sin(p.y+p.x * 2.0) + 0.2);
	
	len *= len2;
	
	float circle = 2.5 / length(vec2(sin(p.x + time), p.y));
	
	len *= circle;
	
	float vv = smoothstep(0.0,0.07,len);
	float vv2 = smoothstep(0.0,0.09,len+(sin(time+(p.x*0.4))*0.05));
	float vv3 = smoothstep(0.0,0.11,len+(sin(time*.5-(p.y*0.4))*0.09));
	
	vec3 color = vec3(1.0*vv3,vv2*0.8,vv*0.6)* vv;
	
	
	
	gl_FragColor = vec4(color, 1.0);

}