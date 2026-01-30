#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//background
vec3 nrand3( vec2 co )
{
    vec3 a = fract(cos(co.x*8.3e-3 + co.y)*vec3(1.3e5, 4.7e5, 2.9e5));
    vec3 b = fract(sin(co.x*0.3e-3 + co.y)*vec3(8.1e5, 1.0e5, 0.1e5));
    vec3 c = mix(a, b, 0.5);
    return c;
}

void background(in vec2 pos, out vec4 color) {
//vec2 p = gl_FragCoord.xy / resolution.xy + floor(resolution.xy * mouse.xy) / resolution.xy;
	vec2 seed = floor((pos * 1.8) * resolution);
	vec3 rnd = nrand3(seed);
	color = vec4(2.0 * pow(abs(rnd.y),60.0));
}

void drop(in vec2 coord, in vec2 pos, in float range, out float height) {
	float y = clamp(coord.y - pos.y, 0.0, range * 6.0);
	float dist = range - clamp(length(coord - vec2(pos.x, pos.y + y)), 0.0, range);
	float z = 1.0 - (y / (2.0 * range));
	height = dist*z;
}

float map(in vec3 p) 
{
	vec3	o = p;
	p 		*= .25;

	float res 	= 1.;
	vec3 c 		= p;
	for (int i = 0; i < 4; i++) 
	{	
		p 	= fract(abs(p-.125)/dot(p,p));
		p	+= p.yzx-.5;
		res 	+= clamp(1./abs(16.*dot(p,c)), .001, res)/1.5;
	}

	return max(.00001, res);
}



#define N 650.0

// Rain heightmap
void rain(in vec2 pos, out float height) {
	
	// Change direction
	float a = 0.9;
	float x = cos(a)*pos.x - cos(a)*pos.y;
	float y = sin(a)*pos.x + tan(a)*pos.y;
	pos.x = x;
	pos.y = y;
	
	
	height = 0.0;;
	for (float i = 0.0; i < N; i += 1.0) {
		float y = mod(-time*i/N/2.0, 2.0) - 0.5;
		float x = tan(i)*i/N/2.0;
		vec2 drop_pos = vec2(x, y);
		drop(pos, drop_pos, (1.0/N)*2.0*(0.5+y), y);
		height = max(y, height);
	}
}

void main( void ) {
	float width = max(resolution.x, resolution.y);
	vec2 pos = (gl_FragCoord.xy / width) - resolution / width / 2.0;
	
	// Calculate position displacement
	float dy = 0.005;
	float dy2 = 0.5*dy;
	float dx = 0.5*dy;
	
	vec3 rays[4];
	rays[0] = vec3(pos + vec2(0.0, dy), 0.3);
	rays[1] = vec3(pos + vec2(-dx,-dy2), 0.5);
	rays[2] = vec3(pos + vec2(dx,-dy2), 1.0);
	rays[3] = vec3(pos, 1.5);
	
	for (int i = 0; i < 4; ++i) {
		rain(rays[i].xy, rays[i].z);
	}
	
	vec3 dir = normalize(cross(rays[0]-rays[1], rays[2]-rays[1]));
	vec3 col = rays[3] + dir * (-rays[3].z/dir.z);
	pos = col.xy;
	vec4 color = vec4(0);
	background(pos, color);
	color.zy += rays[3].z*50.5;
	gl_FragColor = color * map(rays[3]);

	
}