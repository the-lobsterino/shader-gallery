precision highp float;

uniform vec2 resolution;
uniform vec4 mouse;
uniform float time;

vec3 spherePosition;
vec2 e = vec2(-1., 1.)*.1;
vec2 uv;
	
vec3 cameraPosition;
float focalLength = 2.0;
vec3 up = vec3(0, 1, 0);
vec3 right = vec3(1, 0, 0);
vec3 forward = vec3(0, 0, -1);

vec3 ro;
vec3 rd;

vec3 normVecX = vec3(0.0001, 0, 0);
vec3 normVecY = vec3(0, 0.0001, 0);
vec3 normVecZ = vec3(0, 0, 0.0001);
	
float eps = 0.001;
float t = 0.0;
float d = 0.0;
int steps = 0;

float fakeAmbientOcclusion = 0.0;
vec3 finalColor = vec3(1.0);

#define MAX_STEPS 90


float sdSphere(vec3 p, float radius) {
	
    	return length(p) - radius;
	
	/* Instead used squared distance to save on the sqrt() call inside length() function - 
	   Does this speed up rendering at all? */
	//return (p.x * p.x) + (p.y * p.y) + (p.z * p.z) - (radius * radius);
}

float map(vec3 p) {
	
	/* single Sphere */
    	//spherePosition = vec3(0.0, 0.0, -10.0);
	//p -= spherePosition;
	//return sdSphere(p, 1.0);
	
	/* repeated Spheres */
	p.xyz = mod(p.xyz, 1.0) - vec3(0.5);
	return sdSphere(p, 0.25);
    	
}

vec3 calcNormal(vec3 p) {

	return normalize(vec3(
		map(p + normVecX) - map(p - normVecX),
		map(p + normVecY) - map(p - normVecY),
		map(p + normVecZ) - map(p - normVecZ)));
	
}

/*
vec3 calcNormal(const in vec3 p)
{  
	return normalize(e.yxx*map(p + e.yxx) + 
			 e.xxy*map(p + e.xxy) + 
			 e.xyx*map(p + e.xyx) - 
			 e.yyy*map(p + e.yyy) );   
}
*/
float ambientOcclusion(vec3 p, vec3 n)
{
	float stepSize = 0.01;
	float t = stepSize;
	float oc = 0.0;
	for(int i = 0; i < 5; ++i)
	{
		float d = map(p + n * t);
		oc += t - d;
		t += stepSize;
	}

	return clamp(oc, 0.0, 1.0);
}


void main() {
	
	uv = 2.0 * gl_FragCoord.xy / resolution - 1.0;
	uv.x *= resolution.x / resolution.y;
    
	cameraPosition = vec3(sin(time),0.0, -time);
	
	ro = cameraPosition;
	rd = normalize((forward * focalLength) + (right * uv.x) + (up * uv.y));
    
    	
    	t = 0.0;
    	d = 0.0;
	steps = 0;
	
    	for(int i = 0; i < MAX_STEPS; i++) {
        	d = map(ro + rd * t);
		if(d < eps || t > 20.0) break;
        	t += d;
		steps++;
    	}
	
	//fakeAmbientOcclusion = 1.0 - float(steps) / float(MAX_STEPS);
	//finalColor = vec3(fakeAmbientOcclusion * 1.2);
	
	vec3 hitLocation = vec3(ro + rd * t);
    	vec3 normal = calcNormal(hitLocation);
	//finalColor = vec3(1.0, 0.3, 0.0);
	finalColor = vec3(mod(hitLocation.x, 3.0), mod(hitLocation.y, 3.0), mod(hitLocation.z, 3.0));
	finalColor *= vec3( 1.0 - ambientOcclusion(hitLocation, normal) );
	
    	//vec3 lightDir = normalize(vec3(sin(time)*10.0,10.0,cos(time)*10.0));
	//vec3 lightPos = vec3(-10,10,0);
	vec3 lightPos = vec3(sin(time) * 3.0,4,cos(time)*3.0);
	vec3 lightDir = normalize(vec3(-lightPos));
	
    	float diffuse = max(0.0, dot(-lightDir, rd)); //What is this effect called???? This is so cool!!!!
	//float diffuse = max(0.0, dot(-lightDir, normal));
 
    	float specular = clamp(dot(reflect(rd, normal), -lightDir), 0.0, 1.0);
    	specular = pow(specular,40.0);
	
    	finalColor *= (diffuse + specular);

    	if(t > 20.0) {
        	finalColor = vec3(0.0); // background color
    	}
	
    	gl_FragColor = vec4(finalColor, 1.0);
	
}