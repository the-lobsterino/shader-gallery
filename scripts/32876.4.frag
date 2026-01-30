#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2  r = resolution;       // resolution
const float PI = acos(-1.0);

float hat(float x) { return (0.5 - pow(abs(x - 0.5),0.7)) * 2.0; }

// flower data
#define LEAFS 6.0
#define r1 0.42
#define r2 0.52

// ...missing antialiasing...

void main(void)
{
	// fragment position
	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
	float d = length(p);
	float angle = atan(p.y, p.x) + 0.1*time;
	float l = r2 * hat(mod(angle / (2.0 * PI) * LEAFS, 1.0)) + r1;
	if(d < l)
	{
	  vec3 col = mix (vec3(0.8), vec3(10.8, 1.5-l, 0.0), 6.*l*d);
	  gl_FragColor = vec4(col, 1.0);
	}
	else
	  gl_FragColor = vec4(vec3(0.0), 1.0);
}
