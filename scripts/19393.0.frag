#ifdef GL_ES
precision mediump float;
#endif

#define Scale 500.0
#define Move vec2(-50.0, 0.0)
#define Color1 vec4(1.0, 0.9, 0.4 ,1.0)
#define Color2 vec4(0.4, 0.25, 0.15 ,1.0)


#define PI 3.14159265358979
#define deg_to_rad 0.017453292519943295
#define rad_to_deg 57.29577951308232

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hex( vec2 p, vec2 h )
{
	vec2 q = abs(p);
	float theta = (mod((atan(p.y,p.x)+time*0.5), 72.0*deg_to_rad)-36.0*deg_to_rad);
	return (1.1-abs(theta)) * length(p) - h.x;
}

void main( void )
{
	vec2 grid = vec2(0.692, 0.4) * Scale;
	float radius = 0.09 * Scale;
	radius *= 1.0-min(1.0, max(0.0, gl_FragCoord.x-300.0)/200.0);
	vec2 p = gl_FragCoord.xy + (Move*time);

	vec2 p1 = mod(p, grid) - grid*vec2(0.5);
	vec2 p2 = mod(p+grid*0.5, grid) - grid*vec2(0.5);
	float d1 = hex(p1, vec2(radius));
	float d2 = hex(p2, vec2(radius));
	float d = min(d1, d2);
	float c = d>0.0 ? 0.0 : 1.0;
	
	gl_FragColor = Color1*vec4(c) + Color2*vec4(1.0-c);
}
