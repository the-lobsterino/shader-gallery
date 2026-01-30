#ifdef GL_ES
precision mediump float;
#endif
//precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// Basic raymarching tunnel with refraction
//
//
// Created with the help of 
// 	http://9bitscience.blogspot.fr/2013/07/raymarching-distance-fields_14.html


// Error margin
const float epsilon = 0.001;

// Infinite value
const float inf = 1e20;

//small time
float modATime = mod(time, radians(360.));
float modSTime = mod(time, 1000.);

float random2f( vec2 seed )
{
	return mod(fract(sin(dot(seed, vec2(14.9898,78.233))) * 43758.5453), 1.0);
}


// Sphere distance function
float sdSphere(vec3 rayPos){
	return length(rayPos);
}

// Box distance function
float udBox(vec3 rayPos, vec3 bounds ){
  return length(max(abs(rayPos)-bounds,0.0));
}

// Box distance function
float udCube(vec3 rayPos){
  return length(max(abs(rayPos) - vec3(.5, .5, .5),0.0));
}





// polynomial smooth min (k = 0.1);
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

// Volume substraction operation
float opS( float d1, float d2 )
{
    return max(d1, -d2);
}

// Smooth volume union operation
float opSU( float d1, float d2 )
{
    return smin(d1,d2, 50.1);
}

// Volume union operation
float opU( float d1, float d2 )
{
    return min(d1,d2);
}
// Primitive repetition operation
vec3 opRep( vec3 p, vec3 c )
{
    vec3 q = mod(p,c)-0.5*c;
    return  q ;
}

//
// Eye/Camera position
//
vec3 eye = vec3(0., 50. + 0.*25. * sin(time), 1.*modSTime*100.);
vec2 iresolution = 1./resolution;

// Function to get distance to nearest object in the scene
float distanceField(vec3 p) {
	// volume deformation
	p.y = p.y + sin(p.z/100. + modATime)*sin(p.x/100. + modATime)*10.;
	// drawing of the scene
	float d;
	float columnSize = 10.;
	d = sdSphere(opRep(p, vec3(10.*columnSize))) - columnSize;
	
	d = opU(d , udBox(p - vec3(0., eye.y-100., 0.), vec3(inf, 1., inf)));
	d = opU(d , udBox(p - vec3(0., eye.y+100., 0.), vec3(inf, 1., inf)));
	
	d = opU(d , udBox(p - vec3(eye.x -100., 100., 0.), vec3(1., inf, inf)));
	d = opU(d , udBox(p - vec3(eye.x +100., 100., 0.), vec3(1., inf, inf)));
	
	
	
	return d ;
}

// Function to get the normal for a point in space
vec3 normal(vec3 p) {
	vec3 e = vec3(0.0,epsilon,0.0);
	
	return normalize(vec3(
			distanceField(p+e.yxx)-distanceField(p-e.yxx),
			distanceField(p+e.xyx)-distanceField(p-e.xyx),
			distanceField(p+e.xxy)-distanceField(p-e.xxy)
			)
		);	
}

// Raymarching function
vec4 raymarch(vec3 rayOrigin, vec3 rayDirection) {
	float t = 100.0;
	const int maxSteps = 64;
	vec3 p;
	for(int i = 0; i < maxSteps; i++) {
		p = rayOrigin + rayDirection * t;
		float dist = distanceField(p);
		float d = dist;
		if(d < epsilon) {
			return vec4(p, i);;
		}
		t += d;
	}
	return vec4(p, maxSteps);
}


// reflected ray generation function
vec3 reflection(vec3 p, vec3 normalValue, vec3 rayDir){
	return reflect(rayDir, normalValue);	
}
	
// color calculation function
vec3 pointColor(vec3 p, vec3 normal, float dist){
	//return vec3(dist);
	return (abs(mod(p/100. +modSTime/4.,2.)*dist)+ normal);
}

void main()
{
	// Normalized pixel position relative to center
	float u = gl_FragCoord.x * 2.0 * iresolution.x - 1. + (-0.5  +mouse.x)*2.;
	float v = (gl_FragCoord.y * 2.0 * iresolution.y - 1. +(-0.5 + mouse.y)*3.)*resolution.y * iresolution.x;
	
	// field of view
	float fov = radians(90.);
	float sfov = sin(fov);
	
	
	// Extreme rays direction
	vec3 up = vec3(0, sfov, 0);
	vec3 right = vec3(sfov, 0, 0);
	vec3 forward = vec3(0., 0., 1.);
	
	
	// Calculation of the intersection of the ray and the scene
	vec3 roA = eye + right * u + up * v - forward;
	vec3 rdA = normalize(vec3(u,v, 0.) + forward);
	vec4 resultA = raymarch(roA, rdA);
	vec3 normalValueA = normal(resultA.xyz);
	float distA = 1. - resultA.w/64.;
	
	// Calculation of the reflection(s)
	vec3 roB = resultA.xyz;
	vec3 rdB = reflection(resultA.xyz, normalValueA, rdA);
	vec4 resultB = raymarch(roB, rdB);
	vec3 normalValueB = normal(resultB.xyz);
	float distB = 1. -resultB.w/64.;
	

	// point color
	vec3 colorA = (pointColor(resultA.xyz, normalValueA, 1.));
	
	// reflected point color
	vec3 colorB = (pointColor(resultB.xyz, normalValueB, 1.));
	
	// color attribution
	gl_FragColor = vec4((colorA*0.75 + colorB*0.25)/2., 1.);
}
