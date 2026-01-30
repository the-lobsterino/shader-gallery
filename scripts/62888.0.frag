#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = radians(180.0);

void main()
{
	vec2 st = 2.0*(gl_FragCoord.xy-resolution.xy * 0.5) / resolution.y;
	st = vec2(-0.35, 0.0) - st;
	
	float r = length(st);
	float a = atan(st.y, st.x);
	
	//float f = step(a/PI, (mod(time, 1.0)-0.5)*2.0);
	float rays = step(cos(a*15.0-time*2.0), 0.1);
	float circle = step(length(st), 0.4);
	
	float red = rays + circle;
	vec3 color = red==0.0 ? vec3(1.0) : vec3(red,0.0,0.0);
	
	gl_FragColor = vec4(color, 1.0);

}