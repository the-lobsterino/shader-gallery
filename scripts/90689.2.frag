#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution; 

#define R(ang) float c=cos(ang), s=sin(ang)
vec3 rotateY(in vec3 p, float ang) { R(ang); return vec3(p.x*c -p.z*s, p.y, p.x*s +p.z*c); }
vec3 rotateX(in vec3 p, float ang) { R(ang); return vec3(p.x, p.y*c -p.z*s, p.y*s +p.z*c); }
vec3 rotateZ(in vec3 p, float ang) { R(ang); return vec3(p.x*c -p.y*s, p.x*s +p.y*c, p.z); }

void main(void) 
{
	vec2 p = 2.0*(gl_FragCoord.xy / resolution.xy) -1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0);
	for (int i = 0; i < 66; i++) 
	{
		float a = float(i)*3.0*0.031415;
		vec2 sc = vec2(1,1); 
		vec3 pos = vec3(cos(a)*sc.x,sin(a)*sc.y, 0.0); 
		pos = rotateY(pos, 0.6*time);
		pos = rotateX(pos, 0.4*time);
		pos = rotateZ(pos, 0.2*time);
		col += clamp(vec3(1,0.8,0.5)/(0.001+abs(12.0*length(p.xy-pos.xy)-4.0)), 0.0, 1000.0);
	}
	col /= 111.1;
	gl_FragColor = vec4(col, 1.0);	
}
