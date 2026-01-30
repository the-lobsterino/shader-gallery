#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// settings
#define MAX_STEPS 100
#define MAX_DISTANCE 100.
#define HIT_DISTANCE .01

uniform float time;
uniform vec2 resolution;


// scene objects
vec4 mySphere;
float myPlane;
vec3 myLight;

float k = 0.;

float dLine(vec3 p, vec3 ro, vec3 rd)
{
	// rd must be normalized
	return length(cross(p - ro, rd));
}

float opFlatPlane(vec3 ro, vec3 rd, float h)
{
	float k = (h - ro.y) / rd.y;
	if(k < 0.)
		return MAX_DISTANCE;
	return k;
}

float opSphere(vec3 ro, vec3 rd, vec4 s)
{
	float d = dLine(s.xyz, ro, rd);
	d = dot(s.xyz - ro, rd) - sqrt(s.w * s.w - d * d);
	if (d < 0.)
		return MAX_DISTANCE;
	return d;
}

float map(float value, float min1, float max1, float min2, float max2) {
  	return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float sdSphere(vec3 p, vec4 s)
{
	return length(p - s.xyz) - s.w;
}

float sdFlatPlane(vec3 p, float height)
{
	return p.y - height; 
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r)
{
	vec3 ab = b - a;
	vec3 ap = p - a;
	
	// noramlized distance from the closest point
	float t = dot(ap, ab) / dot(ab, ab);
	
	// do not go after a or b
	t = clamp(t, 0., 1.);
	vec3 c = a + t * ab;
	
	return length(p - c) - r;
}

float sdTorus(vec3 p, vec2 r)
{
	vec2 q = vec2(length(p.xz) - r.x,p.y);
  	return length(q) - r.y;
}

float dBox(vec3 p, vec3 b)
{
	return length(max(abs(p) - b, 0.));
}

float opGetSD(vec3 ro, vec3 rd)
{
	float d;
	d = min(opSphere(ro, rd, mySphere), opFlatPlane(ro, rd, myPlane));
	
	return d;
}

float getSD(vec3 p)
{
	float d;
	d = min(sdSphere(p, mySphere), sdFlatPlane(p, myPlane));
	return d;
}

vec3 getNormal(vec3 p)
{
	float d = getSD(p);
	vec2 e = vec2(.01, 0);
	
	vec3 n = d - vec3(
		getSD(p - e.xyy),
		getSD(p - e.yxy),
		getSD(p - e.yyx));
	return normalize(n);
}

float rayMarch(vec3 ro, vec3 rd)
{
	return opGetSD(ro, rd);
}

float getLight(vec3 p)
{
	// move light
	myLight.xz += vec2(sin(time), cos(time)) * 2.;
	
	vec3 lightVector = normalize(myLight - p);	
	vec3 normal = getNormal(p);
	
	
	
	// diffuse lighting
	float dif = clamp(dot(lightVector, normal), 0., 1.);
	
	// shadow
	float d = rayMarch(p + normal * .001, lightVector);
	if(d < length(lightVector - p))
		dif *= .1;
	return dif;
}

void main( void ) {

	// normalize the screee
	vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	
	// variables
	float d;
	vec3 col;
	vec3 ro = vec3(0, 1, 0);
	vec3 rd = normalize(vec3(uv.x, uv.y + .1, 1));
	
	// set Sphere and plane
	mySphere = vec4(0, 1, 6, 1);
	myPlane = 0.;
	myLight = vec3(0, 5, 6);
	
	// calculate color
	d = rayMarch(ro, rd);
	vec3 p = ro + rd * d;
	
	float dif = getLight(p);
	//col = vec3(map(k, 0., 200., 0., 1.));
	col = vec3(dif);
	//col = vec3(opFlatPlane(ro, rd, myPlane)) / 10.;
	gl_FragColor = vec4( col, 1.0 );
}