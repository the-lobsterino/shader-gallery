#ifdef GL_ES
precision mediump float;
#endif


// 			~(ovO)~ http://www.kloumpt.net ~(Ovo)~				//
//											//
// Basic raymarching scene automaticaly generated (works better in a native sandbox)	//
// Added: 	--> Basic shading							//
//											//
//											//
// Created with the help of 								//
// 	http://9bitscience.blogspot.fr/2013/07/raymarching-distance-fields_14.html	//
// and											//
// 	http://kittykat.eu								//
// 											//
// 			~(ovO)~ http://www.kloumpt.net ~(Ovo)~				//

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Error margin
const float epsilon = 0.5*0.043543454301;

// PI :)
const float pi = 3.14159265359;

// Infinite value
const float inf = 1e20;

// Small time
float modATime = mod(time, radians(360.));
float modSTime = mod(time, 1000.);

//Matric usefull fro perlin noise
const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

// Eye/Camera position
vec3 eye = vec3(100.*cos(-time/4.), 0., 100.*sin(-time/4.));

// Camera rotation
float xrot = 0.;
float yrot = time/4. - pi/2.;
float zrot = 0.;

// Camera field of view
float fov = 90.;

// Inverse resolution
vec2 iresolution = 1./resolution;

// Positive sinus and cosinus
float posCos = cos(time)*0.5 + 0.5;
float posSin = sin(time)*0.5 + 0.5;

// Simple light
vec3 lightPos = vec3(-20.*cos(time*1.),  0., -20.*sin(time*1.));

// Rotation calculation
mat3 rotationMatrix(vec3 axis, float angle){
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat3(
		oc * axis.x * axis.x + c,          	oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
		oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
		oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c
	);
}


float random2f( vec2 seed ){
	return mod(fract(sin(dot(seed, vec2(14.9898,78.233))) * 43758.5453), 1.0);
}


float noise( in vec2 x )
{
	return sin(1.5*x.x)*sin(1.5*x.y);
}


float fbm4( vec2 p ){
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}


// Sphere distance function
float sdSphere(vec3 rayPos){
	return length(rayPos);
}


// Box distance function
float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}


// Box distance function
float sdCube( vec3 p){
  vec3 d = abs(p) - vec3(0.5);
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}


// polynomial smooth min (k = 0.1);
float smin( float a, float b, float k ){
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}


// Smooth volume union operation
float opSU( float d1, float d2 ){
    return smin(d1,d2, 0.1);
}


// Volume substraction operation
float opS( float d1, float d2 ){
    return max(d1, -d2);
}


// Volume union operation
float opU( float d1, float d2 ){
    return min(d1,d2);
}


// Volume intersection function
float opI( float d1, float d2 ){
    return max(d1,d2);
}


// Primitive repetition operation
vec3 opRep( vec3 p, vec3 c ){
    vec3 q = mod(p,c)-0.5*c;
    return  q ;
}


// Primitive centered repetition operation
vec3 opCRep( vec3 p, vec3 c ){
    vec3 q = mod(p+0.5*c, c)-0.5*c;
    return  q ;
}


// Function to draw a cross parallel to the x,z
float udCross(vec3 p){
	float A = sdBox(p, vec3(inf, 1., 1.));
	float B = sdBox(p, vec3(1., 1., inf));
	return opU(A, B);
}


// Reflected ray generation function
vec3 reflection(vec3 p, vec3 normalValue, vec3 rayDir){
	return reflect(rayDir, normalValue);	
}


// Simple shading
float shade(vec3 p, vec3 normalValue, vec3 lightPosition, float raysLength){
	vec3 lightDirection = normalize(lightPosition - p);
	float lightIntensity = ((1000. - length(lightPosition - p))/(1000.));
	return (1.-clamp(-0.5+(radians(180.)-asin(dot(normalValue, lightDirection)))/radians(180.), 0., 1.)) * lightIntensity;	
}

float distanceField(vec3 p){
	float d = inf;
	float dOld = 0.;

	d = opU(d, sdSphere(p - lightPos- lightPos-vec3(.1)) - 5.);

	d = opU(d, sdBox(p - vec3(47.311266, 44.187748, -45.08087), vec3(6.036884, 1.443915, 9.757989)));

	d = opU(d, sdBox(p - vec3(-7.878962, -46.354942, 16.803447), vec3(5.669685, 0.966549, 0.279311)));

	d = opU(d, sdSphere(p - vec3(6.86146, -2.021484, -34.130866)) - 9.533352);

	d = opU(d, sdBox(p - vec3(-28.724367, -37.5033, 40.724971), vec3(8.776342, 8.908304, 3.773281)));

	d = opU(d, sdBox(p - vec3(-24.101133, 46.742805, -38.090056), vec3(8.098231, 5.554106, 0.484691)));

	d = opU(d, sdSphere(p - vec3(41.128388, -9.441968, 28.258152)) - 6.821434);

	d = opU(d, sdSphere(p - vec3(26.863248, 32.1944, 11.740233)) - 9.436174);

	d = opU(d, sdSphere(p - vec3(-13.423084, -18.343227, -33.039594)) - 2.411936);

	d = opU(d, sdBox(p - vec3(-21.51669, 15.949075, -0.00539), vec3(1.903068, 8.253086, 1.803766)));

	d = opU(d, sdBox(p - vec3(-2.7387, -43.926315, -12.555061), vec3(8.155641, 7.740106, 4.110346)));

	d = opU(d, sdSphere(p - vec3(-15.282327, 7.379415, 27.5077)) - 6.909054);

	d = opU(d, sdSphere(p - vec3(-35.958629, -49.1616, -33.819369)) - 5.466121);

	d = opU(d, sdSphere(p - vec3(26.13751, -16.596309, 48.715226)) - 5.583233);

	d = opU(d, sdBox(p - vec3(27.248963, 33.077222, 13.806749), vec3(1.629218, 0.885708, 8.265153)));

	d = opU(d, sdBox(p - vec3(6.706488, 2.089848, 10.637877), vec3(1.527119, 9.883988, 4.596689)));

	d = opU(d, sdBox(p - vec3(44.924843, 10.690669, 10.48292), vec3(0.281011, 6.57524, 4.035157)));

	d = opU(d, sdSphere(p - vec3(11.608546, 28.379955, -7.031643)) - 0.061599);

	d = opU(d, sdBox(p - vec3(-5.627375, 29.065109, -35.451338), vec3(3.843093, 2.383019, 7.482655)));

	d = opU(d, sdSphere(p - vec3(34.171943, -39.82123, 15.276616)) - 3.831118);

	d = opU(d, sdBox(p - vec3(-29.259201, 36.97737, -30.159968), vec3(1.514114, 6.771049, 8.953603)));

	return d;
}

// Touched objects
int object = -1;
float finalDistanceField(vec3 p){
	float d = inf;
	float dOld = 0.;

	d = opU(d, sdSphere(p - lightPos-vec3(.1)) - 5.);
	d = opU(d, sdBox(p - vec3(47.311266, 44.187748, -45.08087), vec3(6.036884, 1.443915, 9.757989)));
	if(abs(d - dOld)> 0.){
		object = 0;
}
	dOld = d;

	d = opU(d, sdBox(p - vec3(-7.878962, -46.354942, 16.803447), vec3(5.669685, 0.966549, 0.279311)));
	if(abs(d - dOld)> 0.){
		object = 1;
}
	dOld = d;

	d = opU(d, sdSphere(p - vec3(6.86146, -2.021484, -34.130866)) - 9.533352);
	if(abs(d - dOld)> 0.){
		object = 2;
}
	dOld = d;

	d = opU(d, sdBox(p - vec3(-28.724367, -37.5033, 40.724971), vec3(8.776342, 8.908304, 3.773281)));
	if(abs(d - dOld)> 0.){
		object = 3;
}
	dOld = d;

	d = opU(d, sdBox(p - vec3(-24.101133, 46.742805, -38.090056), vec3(8.098231, 5.554106, 0.484691)));
	if(abs(d - dOld)> 0.){
		object = 4;
}
	dOld = d;

	d = opU(d, sdSphere(p - vec3(41.128388, -9.441968, 28.258152)) - 6.821434);
	if(abs(d - dOld)> 0.){
		object = 5;
}
	dOld = d;

	d = opU(d, sdSphere(p - vec3(26.863248, 32.1944, 11.740233)) - 9.436174);
	if(abs(d - dOld)> 0.){
		object = 6;
}
	dOld = d;

	d = opU(d, sdSphere(p - vec3(-13.423084, -18.343227, -33.039594)) - 2.411936);
	if(abs(d - dOld)> 0.){
		object = 7;
}
	dOld = d;

	d = opU(d, sdBox(p - vec3(-21.51669, 15.949075, -0.00539), vec3(1.903068, 8.253086, 1.803766)));
	if(abs(d - dOld)> 0.){
		object = 8;
}
	dOld = d;

	d = opU(d, sdBox(p - vec3(-2.7387, -43.926315, -12.555061), vec3(8.155641, 7.740106, 4.110346)));
	if(abs(d - dOld)> 0.){
		object = 9;
}
	dOld = d;

	d = opU(d, sdSphere(p - vec3(-15.282327, 7.379415, 27.5077)) - 6.909054);
	if(abs(d - dOld)> 0.){
		object = 10;
}
	dOld = d;

	d = opU(d, sdSphere(p - vec3(-35.958629, -49.1616, -33.819369)) - 5.466121);
	if(abs(d - dOld)> 0.){
		object = 11;
}
	dOld = d;

	d = opU(d, sdSphere(p - vec3(26.13751, -16.596309, 48.715226)) - 5.583233);
	if(abs(d - dOld)> 0.){
		object = 12;
}
	dOld = d;

	d = opU(d, sdBox(p - vec3(27.248963, 33.077222, 13.806749), vec3(1.629218, 0.885708, 8.265153)));
	if(abs(d - dOld)> 0.){
		object = 13;
}
	dOld = d;

	d = opU(d, sdBox(p - vec3(6.706488, 2.089848, 10.637877), vec3(1.527119, 9.883988, 4.596689)));
	if(abs(d - dOld)> 0.){
		object = 14;
}
	dOld = d;

	d = opU(d, sdBox(p - vec3(44.924843, 10.690669, 10.48292), vec3(0.281011, 6.57524, 4.035157)));
	if(abs(d - dOld)> 0.){
		object = 15;
}
	dOld = d;

	d = opU(d, sdSphere(p - vec3(11.608546, 28.379955, -7.031643)) - 0.061599);
	if(abs(d - dOld)> 0.){
		object = 16;
}
	dOld = d;

	d = opU(d, sdBox(p - vec3(-5.627375, 29.065109, -35.451338), vec3(3.843093, 2.383019, 7.482655)));
	if(abs(d - dOld)> 0.){
		object = 17;
}
	dOld = d;

	d = opU(d, sdSphere(p - vec3(34.171943, -39.82123, 15.276616)) - 3.831118);
	if(abs(d - dOld)> 0.){
		object = 18;
}
	dOld = d;

	d = opU(d, sdBox(p - vec3(-29.259201, 36.97737, -30.159968), vec3(1.514114, 6.771049, 8.953603)));
	if(abs(d - dOld)> 0.){
		object = 19;
}
	dOld = d;

	return d;
}


vec3 pointColor(vec3 p, vec3 normalValue, vec3 rd, float dist){
	if(length(p - eye)>200.){
		return vec3(0.);
	}

	if(object == 0){
		return dist * vec3(0.219778, 0.619145, 0.680002);
	}

	if(object == 1){
		return dist * vec3(0.24772, 0.586515, 0.353679);
	}

	if(object == 2){
		return dist * vec3(0.606035, 0.922611, 0.186432);
	}

	if(object == 3){
		return dist * vec3(0.248623, 0.270081, 0.193888);
	}

	if(object == 4){
		return dist * vec3(0.765932, 0.458496, 0.752528);
	}

	if(object == 5){
		return dist * vec3(0.49435, 0.030082, 0.897752);
	}

	if(object == 6){
		return dist * vec3(0.467356, 0.328198, 0.098774);
	}

	if(object == 7){
		return dist * vec3(0.606184, 0.043805, 0.718596);
	}

	if(object == 8){
		return dist * vec3(0.132876, 0.813063, 0.070634);
	}

	if(object == 9){
		return dist * vec3(0.503283, 0.246906, 0.205347);
	}

	if(object == 10){
		return dist * vec3(0.915175, 0.938652, 0.481332);
	}

	if(object == 11){
		return dist * vec3(0.001437, 0.13628, 0.459933);
	}

	if(object == 12){
		return dist * vec3(0.748061, 0.150961, 0.919958);
	}

	if(object == 13){
		return dist * vec3(0.936997, 0.230825, 0.057049);
	}

	if(object == 14){
		return dist * vec3(0.084619, 0.669855, 0.163368);
	}

	if(object == 15){
		return dist * vec3(0.394782, 0.802371, 0.918999);
	}

	if(object == 16){
		return dist * vec3(0.141091, 0.014183, 0.87724);
	}

	if(object == 17){
		return dist * vec3(0.042151, 0.689455, 0.941508);
	}

	if(object == 18){
		return dist * vec3(0.068622, 0.146526, 0.426472);
	}

	if(object == 19){
		return dist * vec3(0.796902, 0.335831, 0.375351);
	}

	return vec3(0.);
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
vec4 raymarch(vec3 rayOrigin, vec3 rayDirection){
	float t = 0.0;
	const int maxSteps = 64;
	vec3 p;
	for(int i = 0; i < maxSteps; i++) {
		p = rayOrigin + rayDirection * t;
		float dist = distanceField(p);
		float d = dist;
		if(d < epsilon || length(p - eye)>200.) {
			finalDistanceField(p);
			return vec4(p, float(i)/float(maxSteps));
		}
		t += d;
	}
	return vec4(p, 1.);
}

void main(){
	// Normalized pixel position relative to center
	float u = gl_FragCoord.x * 2.0 * iresolution.x - 1.;
	float v = resolution.y * iresolution.x*(gl_FragCoord.y * 2.0 * iresolution.y - 1.);
	
	
	// Extreme rays direction
	vec3 up = vec3(0., 1., 0.);
	vec3 right = vec3(1., 0., 0.);
	vec3 forward = vec3(0., 0., tan(sin(radians(180. - fov)/2.)));
	

	
	// Calculation of the intersection of the ray and the scene
	vec3 ro = eye + right * u + up * v - forward;
	vec3 rd = normalize(vec3(u, v, 0.) + forward);
	rd *= rotationMatrix(vec3(1.,0.,0.), xrot);
	rd *= rotationMatrix(vec3(0.,1.,0.), yrot);
	rd *= rotationMatrix(vec3(0.,0.,1.), zrot);

	vec4 result = raymarch(ro, rd);
	vec3 normalValue = normal(result.xyz);
	float dist = 1. - result.w;
	
	// Point color calculation
	vec3 color = pointColor(result.xyz, normalValue, rd, dist);
	
	// Pixel color attribution
	gl_FragColor = vec4(color, 1.) * shade(result.xyz, normalValue, lightPos, 10000.);
}

