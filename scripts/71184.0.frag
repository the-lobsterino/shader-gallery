#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 ray, vec3 dir, vec3 center, float radius)
{
	vec3 rc = ray-center;
	float c = dot(rc, rc) - (radius*radius);
	float b = dot(dir, rc);
	float d = b*b - c;
	float t = -b - sqrt(abs(d));
	float st = step(0.0, min(t,d));
	return mix(-1.0, t, st);
}

void main( void ) {
	float aspRatio = resolution.x / resolution.y;
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	vec2 uv = vec2(pos.x*2.0-1.0, pos.y*2.0-1.0);
	if(aspRatio>1.)
	  uv.x *= aspRatio;
	else
	  uv.y /= aspRatio;		
	
	vec3 rd = vec3(0.0, 0.0, -1.0);
	vec3 ro = (vec3(uv, 5.0));
	vec3 p = vec3(0.0, 0.0, 0.0);
	float t = sphere(ro, rd, p, 1.0);
	vec3 nml = normalize(p - (ro+rd*t));
	if (t > 1.0) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * dot(nml, rd);
	}
}
