#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


struct HitRecord
{
	float t;
};

bool RayTrace(out HitRecord rec, in vec3 ro, in vec3 rd)
{
	
	return true;
}

void main(void)
{
	vec2 u = gl_FragCoord.xy, R = resolution.xy;
	vec2 p = (u+u-R)/R.y;
	
	float t = length(p)-.5;
	float a = smoothstep(3./R.y,0.,t);
	
	vec3 col = vec3(a);
	
	gl_FragColor = vec4(col, 1);
}