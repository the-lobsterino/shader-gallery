// paste into glslsandbox.com
// I

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_DIST 8.0
#define MAX_STEPS 64
#define THRESHOLD 0.005
#define EPSILON 0.001

float opSmoothUnion( float d1, float d2, float k ) 
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}

vec3 Rotate(vec3 p, float a)
{
	return vec3(p.x * cos(a) - p.y * sin(a), p.y * cos(a) + p.x * sin(a), p.z);
}

float dSphere(vec3 p, vec3 pos, float radius) 
{ 
	return length(p - pos) - radius;
}

float dHexPrism( vec3 p, vec2 h )
{
    const vec3 k = vec3(-0.8660254, 0.5, 0.57735);
    p = abs(p);
    p.xy -= 2.0*min(dot(k.xy, p.xy), 0.0)*k.xy;
    vec2 d = vec2(
       length(p.xy-vec2(clamp(p.x,-k.z*h.x,k.z*h.x), h.x))*sign(p.y-h.x),
       p.z-h.y );
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

vec3 albedo[2];

vec3 GetColor(int material, vec3 pos, vec3 normal)
{
	if (material==0)
		return albedo[0]  + reflect(vec3(0.0), normal);		// grey
	if (material==1)
		return albedo[1] * sin(atan(pos.z + pos.y*1.5, pos.x) * 50.0 + time * 10.0);
	
	return vec3(1.0,0.0,1.0);
}

float getDist(vec3 p, out int materialID)
{
	vec3 p1 = p;
	
	p = Rotate(p, radians(90.0)).yzx;
	p = Rotate(p, time).xyz;
	
	
	vec3 Ipos = p + vec3(0.0, 0, 0);
	
	float ILeg = dHexPrism(Ipos, vec2(.035, 0.25));
	float ICross1 = dHexPrism(Rotate(Ipos + vec3(0.0, 0.0, 0.32), 3.14159).zyx, vec2(.05, .2));
	float ICross2 = dHexPrism(Rotate(Ipos + vec3(0.0, 0.0, -0.32), 3.14159).zyx, vec2(.05, .2));

	float I = opSmoothUnion(ICross1, ILeg, 0.07);
	I = opSmoothUnion(I, ICross2, 0.07);
	
	materialID = 0;
	float background = abs(dSphere(p1, vec3(0), 12.0));
	if (background < THRESHOLD)
		materialID = 1;
	
	return min(I, background);
}

vec3 estimateNormal(vec3 p)
{
	int dummy = 0;
    	return normalize(vec3(
        getDist(vec3(p.x + EPSILON, p.y, p.z), dummy) - getDist(vec3(p.x - EPSILON, p.y, p.z), dummy),
        getDist(vec3(p.x, p.y + EPSILON, p.z), dummy) - getDist(vec3(p.x, p.y - EPSILON, p.z), dummy),
        getDist(vec3(p.x, p.y, p.z  + EPSILON), dummy) - getDist(vec3(p.x, p.y, p.z - EPSILON), dummy)
    ));
}

void main( void )
{
	albedo[0] = vec3(0.25, .25, .25);
	albedo[1] = vec3(0.3, .22, .5);
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	position.y *= resolution.y / resolution.x;
	
	vec3 eye = vec3(0, 0, -1);
	vec3 dir = normalize(vec3(position, 0) - eye);
	vec3 pos = eye;
	int materialID = -1;
	for (int steps=0; steps<MAX_STEPS; steps++)
	{
		float dist = getDist(pos, materialID);
		if (dist < THRESHOLD || dist > MAX_DIST) break;
		pos += dir * dist * 0.8;
	}
	vec3 normal = estimateNormal(pos);
	vec3 color = GetColor(materialID, pos, normal) * (dot(normal, vec3(0,0,-1)) + pow(dot(normal, vec3(0,0,-1)), 10.0)*4.0);
		
	gl_FragColor = vec4( color, 1.0 );

}