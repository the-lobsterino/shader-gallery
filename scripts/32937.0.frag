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
#define LEAFS 7.0
#define r1 0.42
#define r2 0.52

// ...missing antialiasing...
uniform sampler2D backbuffer;
vec2 pixeldensity = 1./resolution;
vec4 texture2DxS(sampler2D s, vec2 p){
	return (
		- texture2D(s, p)
		+ texture2D(s, p + vec2(1,0)*pixeldensity)
		+ texture2D(s, p + vec2(-1,0)*pixeldensity)
		+ texture2D(s, p + vec2(0,1)*pixeldensity)
		+ texture2D(s, p + vec2(0,-1)*pixeldensity)
		+ texture2D(s, p + vec2(1,1)*pixeldensity)
		+ texture2D(s, p + vec2(-1,1)*pixeldensity)
		+ texture2D(s, p + vec2(-1,-1)*pixeldensity)
		+ texture2D(s, p + vec2(1,-1)*pixeldensity)
	) / 7.;
}
void main(void)
{
	// fragment position
	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
	float d = length(p);
	float angle = atan(p.y, p.x) + 0.1*time;
	float l = r2 * hat(mod(angle / (2.0 * PI) * LEAFS, 1.0)) + r1;
	if(d < l)
	{
	  vec3 col = mix (vec3(0.5+0.05*sin(d)), vec3(0.9, 1.5-l, 0.0), sin(d*53.)*0.05+4.*(d-l));
	  gl_FragColor = vec4(col.brg, 1.0);
	}
	else
	  gl_FragColor = vec4(vec3(0.0), 1.0);
	
	
	gl_FragColor = max(gl_FragColor, texture2DxS(
	  backbuffer, (gl_FragCoord.xy
	    + normalize(p)*2.
	)/resolution) - 4./128.);
	gl_FragColor = max(gl_FragColor, texture2DxS(
	  backbuffer, (gl_FragCoord.xy
	    - normalize(p)*pow(2., 4.-length(mouse-.5 - p)*2.)
	)/resolution)*0.99);
}
