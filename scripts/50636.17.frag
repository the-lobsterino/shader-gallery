#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const vec4 bgColor 	= vec4(0.0, 0.0, 0.0, 1.0);
const vec3 objColor 	= vec3(1.0);
const vec3 SphereColor 	= vec3(0.9,0.9,0.9);
const vec3 BoxColor 	= vec3(0.9,0.2,0.8);
const vec3 ambientColor = vec3(0.1);
const vec3 diffuseColor = vec3(1.0);
const vec3 specColor 	= vec3(1.0);

const vec3 X = vec3(1.0,0.0,0.0);
const vec3 Y = vec3(0.0,1.0,0.0);
const vec3 Z = vec3(0.0,0.0,1.0);
const vec2 lt = vec2(0.0,0.0);
const vec2 rt = vec2(1.0,0.0);
const vec2 ld = vec2(0.0,1.0);
const vec2 rd = vec2(1.0,1.0);


#define THICKNESS 	0.01
#define SHINESS		32.0
#define MAX_ITER  	500 
#define MAX_DIST  	20.0
#define EPSILON  	0.001
#define MIN_T	  	0.0 
#define MAX_T	  	200.0 
#define PI		3.1415926
#define R 		5.0
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

vec4 sphere(vec3 pos, float radius){
	return vec4(SphereColor,length(pos) - radius);
}

vec4 sphere2(vec3 pos, float radius){
	return vec4(vec3(0.2,0.7,0.3),length(pos) - radius);
}

vec4 sdBox(vec3 p, vec3 b){
  	vec3 d = abs(p) - b;
 	return vec4(BoxColor,length(max(d,0.0)));// + min(max(d.x,max(d.y,d.z)),0.0);
}

vec4 sdPlane(vec3 p, vec4 n){
  	return vec4(objColor,dot(p,n.xyz) + n.w);
}
mat4 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);

    return mat4(
        vec4(c  , 0.0, s  , 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(-s , 0.0, c  , 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
}

vec4 distfunc(vec3 pos){
	vec4 d_plane = sdPlane(pos,vec4(0.0,1.0,0.0,1.0));
	vec4 d_sphere = sphere(pos+1.5*X, 1.41);
	vec4 d_sphere2 = sphere2(pos-2.5*Z+1.5*X+0.5*Y, 0.5);
	vec4 d_box = sdBox((rotateY(-time)*vec4(pos-2.*X-2.*Z,1.0)).xyz,vec3(1.0));
	//return min(min(d_plane,d_sphere),d_box);
	vec4 final = vec4(0.0);
	if(d_sphere.w==min(d_sphere.w,d_box.w))
		final = d_sphere;
	else
		final = d_box;
	if(d_sphere2.w==min(d_sphere2.w,final.w))
		final = d_sphere2;
	if(d_plane.w == min(d_plane.w,final.w))
		final = d_plane;
	return final;
}

float shadow(vec3 ro, vec3 rd, float maxt, float k){
	float res = 1.0;
	float t = 0.01;
    	for(int i=0; i<MAX_ITER; i++){
        	vec4 h = distfunc(ro + rd*t);
        	if(t > maxt)
			break;
		if(h.w<EPSILON)
			return 0.0;
		res = min(res, k*h.w/t);
        	t += h.w;
    	}
    	return res;
}

vec3 reflection(vec3 ro,vec3 rd,float maxt){
	float t = 0.01;
    	for(int i=0; i<MAX_ITER; i++){
        	vec4 h = distfunc(ro + rd*t);
        	if(t > maxt)
			break;
		if(h.w<EPSILON)
			return h.rgb;
        	t += h.w;
    	}
	return vec3(0.0);
}

vec4 plot(vec2 uv){
	vec3 lightPos 	= vec3(4.0);
	vec3 camPosition = vec3(5.0*cos(0.1*time), 3.0, 5.0*sin(0.1*time));
	vec3 camLookat 	= vec3(0.0);
	vec3 camUp 	= vec3(0.0, 1.0, 0.0);
	vec3 cameraDir 	= normalize(camLookat - camPosition);
	vec3 cameraRight 	= normalize(cross(camUp, camPosition));
	vec3 cameraUp 	= cross(cameraRight, cameraDir);
    	vec3 rayDir = normalize(cameraRight * uv.x + cameraUp * uv.y + cameraDir);
    	float totalDist = 0.0;
    	vec3 pos = camPosition;
    	vec4 dist = vec4(EPSILON); 
    	for (int i = 0; i < MAX_ITER; i++){
        	if (dist.w < EPSILON || totalDist > MAX_DIST)
        		break; 
        	dist = distfunc(pos); 
        	totalDist += dist.w;
        	pos += dist.w * rayDir;
    	}
    
    	if(dist.w < EPSILON) { 
        	vec2 eps = vec2(0.0, EPSILON);
        	vec3 normal = normalize(vec3(
            		distfunc(pos + eps.yxx).w - distfunc(pos - eps.yxx).w,
            		distfunc(pos + eps.xyx).w - distfunc(pos - eps.xyx).w,
            		distfunc(pos + eps.xxy).w - distfunc(pos - eps.xxy).w
        	)); 
        
		float r = length(pos);
		float fi = acos(pos.z/r);
		float the = atan(pos.y,pos.x);
		vec4 texture = vec4(1.0);
		vec3 lightDir = normalize(lightPos - pos);
		float lambertian = max(dot(lightDir, normal), 0.0);
		float specular = 0.5 * pow(max(dot(reflect(lightDir,normal),cameraDir),0.0),SHINESS);     
		vec3 reflection = 0.1*max(dot(reflect(cameraDir,normal), normal), 0.0) * reflection(pos,reflect(cameraDir,normal),MAX_DIST);
		float shadow = shadow(pos,lightDir,distance(lightPos,pos),16.0);
		return vec4(dist.rgb,1.0) * texture * vec4(
				ambientColor +
				shadow * (lambertian * (diffuseColor + reflection)+
				specular * specColor ), 
				1.0);
	} else {
		return bgColor; 
	}
}

void main( void ) {
	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;
	gl_FragColor.rgba = plot(uv);
}