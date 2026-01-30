#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

vec3 light = vec3(-0.577,0.577,0.577);

float sdPlane(in vec3 p)
{
	float b = sin(p.x+time)*sin(p.z+time);
	return p.y - b + 0.8;	
}

float map(in vec3 p)
{
	return sdPlane(p);
}

vec3 getNormal(in vec3 p)
{
	const float d = 0.01;
	return normalize(vec3(
		map(p+vec3(d,0.0,0.0)) - map(p+vec3(-d,0.0,0.0)),
		map(p+vec3(0.0,d,0.0)) - map(p+vec3(0.0,-d,0.0)),
		map(p+vec3(0.0,0.0,d)) - map(p+vec3(0.0,0.0,-d))
	));
}

vec3 getSkyColor(in vec3 p)
{
	float r = 0.37 + 1.0 - p.y - 0.6;
	float g = 0.23;
	float b = p.y + 0.3;
	return vec3(r,g,b);
}

vec3 getColor(in vec3 p)
{
	float r = 0.02 - p.y*0.01;
	float g = 0.0;
	float b = 0.0;
	return vec3(r,g,b);
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x,resolution.y);
	
	vec3 ray = normalize(vec3(p.x * sin(fov),p.y * sin(fov),-cos(fov)));
	
	vec3 camera = vec3(0.0,2.0,7.0);
	
	float dist = 0.0;
	float rayLen = 0.0;
	vec3 rayPos = camera;
	for(int i = 0;i < 100;++i){
		dist = map(rayPos);
		rayLen += dist;
		rayPos = camera + ray * rayLen;
	}
	
	vec3 color = vec3(0.0);
	if(abs(dist) < 0.01){
		vec3 normal = getNormal(rayPos);
		float diff = clamp(dot(normal,light),0.1,1.0);
		color = vec3(diff) * getColor(rayPos);
	}
	color = mix(color,getSkyColor(rayPos),abs(sin(time))*0.36+0.2);
	gl_FragColor = vec4(color,1.0);
}