#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.141592

float sdCapsule( vec2 p, vec2 a, vec2 b, float r )
{
    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float udBox( vec2 p, vec2 b )
{
  return length(max(abs(p)-b,0.0));
}

void main( void ) {
	vec2 p = gl_FragCoord.xy/resolution.xy;
	p.x *= resolution.x/resolution.y; // p.x = p.x * resolution.x/resolution.y;

	vec2 m = mouse;
	m.x *= resolution.x/resolution.y;
	float l = length(p - m);
	
	float cs = 0.5*cos(time*2.) + 0.5;//abs(cos(time));
	float c = step(0.1*cs, l);
	
	float box = udBox(p - vec2(0.5, 0.5), vec2(0.3, 0.3));
	
	float cap = sdCapsule(p, vec2(0.3*cs, 0.3*cs), vec2(0.5*cs, 0.5), 0.1);
	gl_FragColor = vec4(vec3(cap), 1.0);
}