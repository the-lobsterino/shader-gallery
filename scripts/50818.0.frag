precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_ITER 	100
#define MAX_DIST 	10.0
#define EPS		0.001
#define PI		3.14159
#define RADIUS		1.5

const vec3 ZERO		= vec3(0.0);
const vec3 X 		= vec3(1.0,0.0,0.0);
const vec3 Y 		= vec3(0.0,1.0,0.0);
const vec3 Z 		= vec3(0.0,0.0,1.0);

const vec3 AMBIENT	= vec3(0.2);
const vec3 DIFFUSE	= vec3(1.0);
const vec3 SPECULAR	= vec3(1.0);
const float SHINESS	= 32.0;

vec3 sphereColor	= vec3(1.0);
vec3 lightPosition	= vec3(3.0,2.0,4.0);
vec3 camPosition	= vec3(0.0,0.0,3.0);
vec3 camUp 		= vec3(0.0,1.0,0.0);
vec3 camLookat		= vec3(0.0);

vec3 bgColor  		= vec3(0.0);

mat2 mm2(in float deg){
	float c = cos(deg); 
	float s = sin(deg);
	return mat2(c,-s,s,c);
}

float rand(float x,float y){
 	return fract(sin(x*12.9898+y*78.233) * 43758.5453);
}

float interpolate(float a, float b, float x){
  	float ft = x * PI;
  	float f = (1.0 - cos(ft)) * 0.5;
  	return a*(1.0-f) + b*f;
}

float fbm1(float r,float index){
	float x = floor(r);
	float y = fract(r);
	float a = rand(x,2.1*index);
	float b = rand(x+1.0,2.1*index);
	return interpolate(a,b,y)-0.5;
	//return 0.0;
}

vec2 line(vec3 pos, vec3 from, vec3 to,float index){
	vec3 p = pos-from;
	float lp = length(p);
	float len = 1.0*length(to-from);
	vec3 dir = normalize(to-from);
	float k = clamp(dot(p,dir),0.0,len);
	float ins = smoothstep(0.12,.56,lp);
    	float outs = 0.22+smoothstep(.0,.022,abs(lp-len));
    	float id = ins*outs;
	float rr = 0.3*smoothstep(0.1,0.4,k)*(1.0-smoothstep(len-0.3,len,k));
	vec3 offset = rr * (Y*fbm1(1.*k,index)+Z*fbm1(1.*k,index+1.0));
	return vec2(0.4*distance(p,from+k*dir+offset)-0.009/id,id);
}

vec2 map(vec3 p, float i){
    	vec3 en = X*RADIUS;
	float k = mod(i,6.0);
	p.yz *= mm2(PI/3.0*k);
	float j = step(1.0,i)+step(7.0,i)+step(13.0,i);
	p.xy *= mm2(PI/3.0*j);
    	return line(p,ZERO,en,i);
}


vec2 raymarch(vec3 ro, vec3 rd, float index){
	vec2 dist = vec2(EPS);
	float k = 0.0;
	for(int i = 0; i < MAX_ITER; i++){
		dist = map(ro+k*rd,index);
		if(abs(dist.x)<EPS || dist.x>MAX_DIST){
			break;
		} 
		k += dist.x; 	
	}
	return vec2(k,dist.y);
}

vec2 sphere(vec3 pos,vec3 center, float radius){
	return vec2(distance(pos,center) - radius,1.0);
}

vec2 sphereDist(vec3 pos){
	return sphere(pos, ZERO, RADIUS);
}

vec2 raymarchSphere(vec3 ro, vec3 rd){
	vec2 dist = vec2(EPS);
	float k = 0.0;
	for(int i = 0; i < MAX_ITER; i++){
		dist = sphereDist(ro+k*rd);
		if(abs(dist.x)<EPS || dist.x>MAX_DIST){
			break;
		} 
		k += dist.x; 	
	}
	return vec2(k,dist.y);
}

vec3 setupCamera(vec3 pos, vec3 up, vec3 lookat, vec2 uv){
	vec3 camDir = normalize(lookat-pos);
	vec3 camUp = normalize(up);
	vec3 camRight = normalize(cross(camDir,camUp));
	return normalize(camRight*uv.x + camUp*uv.y + camDir);
}

vec3 calcNormal(vec3 p, float d){
	return normalize(vec3(
		(sphereDist(p+EPS*X) - sphereDist(p-EPS*X)).x,
		(sphereDist(p+EPS*Y) - sphereDist(p-EPS*Y)).x,
		(sphereDist(p+EPS*Z) - sphereDist(p-EPS*Z)).x
	    )
	);
}

vec3 calcLight(vec3 p, vec3 lightPos){
	vec3 dir = normalize(lightPos-p);
	vec3 nor = calcNormal(p,0.0);
	vec3 dif = DIFFUSE * max(dot(dir,nor),0.0);
	vec3 spe = 0.5*SPECULAR * pow(max(dot(reflect(-dir,nor),dir),0.0),SHINESS);
	return AMBIENT + dif + spe;
}

vec3 calcDpDx(vec3 ro,vec3 rd,vec3 rdx,vec3 rdy, vec3 nor, float t){
	return t*(rdx*dot(rd,nor)/dot(rdx,nor) - rd);
}

vec3 calcDpDy(vec3 ro,vec3 rd,vec3 rdx,vec3 rdy, vec3 nor, float t){
	return t*(rdy*dot(rd,nor)/dot(rdy,nor) - rd);
}

vec3 textureMapping(vec3 pos,vec3 dposdx,vec3 dposdy,float oid ){
	return vec3(1.0);
}

void main( void ) {
	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy ) / resolution.y;
	vec3 ro = camPosition;
	mat2 mm = mm2(time);
       	ro.xy *= mm;
        ro.xz *= mm;
	//ro.yz *= mm;
	vec3 rd = setupCamera(ro, camUp, camLookat, uv);
	vec3 color = bgColor;
	for(float i = 0.0 ; i < 14.0; i++){
		vec2 rz = raymarch(ro,rd, i + sin(i + time));
		if(rz.x > MAX_DIST || rz.x < EPS) continue;
    		vec3 pos = ro+rz.x*rd;
		float thin = 2.5*map(pos,i).y;
		color = max(color, vec3(1.5,1.2,1.2) * vec3(1.0, thin, 1.0));
	}
	vec2 sphere = raymarchSphere(ro,rd);
	vec3 pos = ro + sphere.x*rd;
	if(sphere.x <= MAX_DIST && sphere.x > EPS){
		color = mix(color,sphereColor*calcLight(pos,lightPosition),0.125);
	}	
	gl_FragColor = vec4(color, 1.0);
}