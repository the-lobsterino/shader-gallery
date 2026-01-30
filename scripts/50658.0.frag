#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int MAX_ITER = 100; 
const float MAX_DIST = 20.0;
const float EPSILON = 0.001;

vec3 cameraOrigin = vec3(2.0, 6.0, 2.0);
vec3 cameraTarget = vec3(0.0, 0.0, 0.0);
vec3 upDirection = vec3(0.0, 1.0, 0.0);
float specularPower = 16.0;
vec4 backgroundColor = vec4(0.0, 0.0, 0.0, 1.0);

const vec2 lt = vec2(0.0,0.0);
const vec2 rt = vec2(1.0,0.0);
const vec2 ld = vec2(0.0,1.0);
const vec2 rd = vec2(1.0,1.0);
const vec4 objColor = vec4(1.0);

#define THICKNESS 	0.01
#define R 		4.0
#define T 		5

float rand(float x, float y, float seed){
	return fract(sin(x * (12.9898) + y * (4.1414) + seed * 11.8753) * 43758.545);
}

float rand(vec2 p, float seed){
	return rand(p.x, p.y, seed);
}

float noise(vec2 uv,float seed){
	vec2 base = floor(uv*R);
	vec2 pot = fract(uv*R);
	vec2 f = smoothstep(0.0, 1.0, pot);  
	return mix(
		mix(rand(base+lt,seed),rand(base+rt,seed),f.x),
		mix(rand(base+ld,seed),rand(base+rd,seed),f.x),
		f.y
	);
} 

float fbm(vec2 uv,float seed) {
	float total = 0.0, amp = 1.0;
	for (int i = 0; i < T; i++){
		total += noise(uv,seed) * amp; 
		uv *= 2.0;
		amp *= 0.5;
	}
	return 1.0-exp(-total*total);
} 

vec4 plotGrid(vec2 uv){
	uv *= R;
	return vec4(THICKNESS/abs(-abs(fract(uv.x)-0.5)+0.5)+THICKNESS/abs(-abs(fract(uv.y)-0.5)+0.5),0.0,0.0,1.0);
}

vec4 plotCircle(vec2 uv){
	return vec4(0.02/abs(length(uv)-0.5),1.0,1.0,1.0);
}

float sphere(vec3 pos, float radius){
    return length(pos) - radius;
}

float distfunc(vec3 pos){
    return sphere(pos, 2.0);
}

vec4 plotBall(vec2 uv,float radius){
    vec3 cameraDir = normalize(cameraTarget - cameraOrigin);
    vec3 cameraRight = normalize(cross(upDirection, cameraOrigin));
    vec3 cameraUp = cross(cameraDir, cameraRight);
    vec3 rayDir = normalize(cameraRight * uv.x + cameraUp * uv.y + cameraDir);
    float totalDist = 0.0;
    vec3 pos = cameraOrigin;
    float dist = EPSILON; 
    for (int i = 0; i < MAX_ITER; i++){
        if (dist < EPSILON || totalDist > MAX_DIST)
        	break; 
        dist = distfunc(pos); 
        totalDist += dist;
        pos += dist * rayDir;
    }
    
    // if a hit, colour
    if(dist < EPSILON) { // At this distance we are close enough to the object that we have essentially hit it

        vec2 eps = vec2(0.0, EPSILON);
        vec3 normal = normalize(vec3(
            distfunc(pos + eps.yxx) - distfunc(pos - eps.yxx),
            distfunc(pos + eps.xyx) - distfunc(pos - eps.xyx),
            distfunc(pos + eps.xxy) - distfunc(pos - eps.xxy)
        )); 
	//normal = normalize(normal+0.5*(fbm(uv+time)-0.5));
        const vec3 lightPos = vec3(4.0,1.0,1.0);
        
        vec3 ambientColor = vec3(0.0);
        vec3 diffuseColor = vec3(1.0);
        vec3 specColor = vec3(1.0);
        vec3 lightDir = normalize(lightPos - pos);
        float lambertian = max(dot(lightDir, normal), 0.0);
        float specular = 0.0;     
        return objColor * vec4(ambientColor +
                      lambertian * diffuseColor +
                      specular * specColor, 1.0);
    } else {
        return backgroundColor; 
    }
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy * 2.0) - 1.0;
	uv.x *= resolution.x/resolution.y;
	//float v = fbm(uv, 0.0);
	gl_FragColor.rgba = plotGrid(uv*vec2(1.,-1.)/dot(uv,uv));
}