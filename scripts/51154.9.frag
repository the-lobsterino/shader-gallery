#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//PBR(Physically Based Rendering) test

#define PI 		3.1415926535897932384626
#define ZERO 		vec3(0.0)
#define X		vec3(1.0,0.0,0.0)
#define Y		vec3(0.0,1.0,0.0)
#define Z		vec3(0.0,0.0,1.0)
#define R		2.0
#define T		4

#define EPSILON		0.001
#define MAX_DIST	80.0
#define MAX_ITER	100

#define MAX_LIGHT	2
#define BALL_ROW	1.0
#define BALL_COL	2.0
#define RADIUS		2.0

#define ALBEDO  	vec3(0.75)
#define METALLIC 	0.99
#define ROUGHNESS 	1.0
#define F0		mix(vec3(0.04),albedo,metallic)
#define AO		1.0

float rand(vec3 seed){
	return fract(sin(dot(seed, vec3(12.9898,78.233,233.33))) * 43758.5453);
}

float rand(vec2 seed){
	return rand(vec3(seed,0.0));
}

float rand(float seed){
	return rand(vec3(seed,0.0,0.0));
}

float noise3(vec3 pos){
	float t = -time*0.0;
	vec3 base = floor(pos*R+t);
	vec3 pot = fract(pos*R+t);
	vec3 f = smoothstep(0.0,1.0,pot);
	float w1 = mix(rand(base),    rand(base+X),    f.x);
	float w2 = mix(rand(base+Z),  rand(base+X+Z),  f.x);
	float w3 = mix(rand(base+Y),  rand(base+X+Y),  f.x);
	float w4 = mix(rand(base+Y+Z),rand(base+X+Y+Z),f.x);
	return mix(
		mix(w1,w3,f.y),
		mix(w2,w4,f.y),
		f.z
	);
}


float fbm3(vec3 pos){
	float total = 0.0, amp = 1.0;
	for (int i = 0; i < T; i++){
		total += noise3(pos) * amp; 
		pos *= 2.0;
		amp *= 0.5;
	}
	return 1.0-exp(-total*total);
}
//
vec3 fresnelSchlick(vec3 albedo,float cosTheta,float metallic){
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

float DistributionGGX(vec3 N, vec3 H, float roughness){
    float a      = roughness*roughness;
    float a2     = a*a;
    float NdotH  = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;
    float nom   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
    return nom / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness){
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;
    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;
    return nom / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness){
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2  = GeometrySchlickGGX(NdotV, roughness);
    float ggx1  = GeometrySchlickGGX(NdotL, roughness);
    return ggx1 * ggx2;
}
//
float plane(vec3 pos,vec3 normal,float h){
	return dot(pos,normalize(normal))-h;
}

float box(vec3 pos,vec3 center,vec3 size){
  	vec3 d = abs(pos-center) - size;
 	return length(max(d,0.0));
}

float torus( vec3 p, vec3 t){
  vec2 q = vec2(length(p.xz)-t.x, p.y+t.z);
  return length(q)-t.y;
}

float cylinder( vec3 p, vec2 h){
   	vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  	return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float solidSphere(vec3 pos, vec3 center, float radius){
	float d = distance(pos,center)-radius;
	return d;
}

float sphere(vec3 pos, vec3 center, float radius){
	float d = solidSphere(pos,center,radius);
	return d;
}

vec2 dmin(vec2 a,vec2 b){
	if(a.x == min(a.x,b.x))
		return a;
	else 
		return b;
}

// return (distance, id)
vec2 dist(vec3 pos){
	float id = 0.0;
	float d = MAX_DIST;
	float obj = id;
	for(float i = -BALL_ROW+1.0; i <= BALL_ROW-1.0; i+=2.0){
		for(float j = -BALL_COL+1.0; j <= BALL_COL-1.0; j+=2.0){	
			float _d = sphere(pos,1.25*(j*X-i*Z-Z)*RADIUS,RADIUS);
			d = min(d,_d);
			if(d == _d){
				obj = id;
			}
			id++;
		}
	}
	float s_id = BALL_ROW*BALL_COL;
	vec2 dp = vec2(plane(pos,Y,-RADIUS),-1.);
	vec2 db = vec2(box(pos-7.0*Z-5.0*X,ZERO,vec3(RADIUS)),s_id);
	vec2 dc = vec2(cylinder(pos+5.*X-5.*Z,vec2(1.0,5.0)),s_id+1.0);
	vec2 dt = vec2(torus(pos+5.*X-5.*Z,vec3(2.0,0.5,1.5)),s_id+2.0);
	vec2 p = vec2(d,obj);
	p = dmin(p,dp);
	p = dmin(p,db);
	p = dmin(p,dc);
	p = dmin(p,dt);
	return p;
}

vec3 setCamera(vec2 uv,vec3 pos,vec3 lookat,vec3 up){
	vec3 camDir = normalize(lookat-pos);
	vec3 camUp = normalize(up);
	vec3 camRight = cross(camDir,camUp);
	return normalize(uv.x*camRight+uv.y*camUp+5.0*camDir);
}

vec3 rayMarching(vec3 ro,vec3 rd,float mint){
	vec2 d = vec2(mint);
	float h = d.x;
	for(int i = 0; i<MAX_ITER; i++){
		d = dist(ro+rd*h);
		if(d.x < EPSILON){ 
			break;
		}
		if(h > MAX_DIST){
			return vec3(MAX_DIST);
		}
		h += d.x;
	}
	return vec3(h,d);
}

vec3 calcNormal(vec3 pos){
	 return normalize(vec3(
        	dist(pos+X*EPSILON).x - dist(pos - X*EPSILON).x,
        	dist(pos+Y*EPSILON).x - dist(pos - Y*EPSILON).x,
        	dist(pos+Z*EPSILON).x - dist(pos - Z*EPSILON).x
    	));
}

float softShadow(vec3 ro, vec3 rd, float mint, float k){
    float res = 1.0;
    float h = mint;
    for(int t = 0; t < MAX_ITER; t++){
        float d = dist(ro+rd*h).x;
        if( d < EPSILON)
            return 0.0;
	if(h > MAX_DIST)
		break;
        res = min(res, k*d/h);
        h += d;
    }
    return res;
}

float calcShadow(vec3 pos,vec3 dir){
	float esp = 100.0*EPSILON;
	float d = rayMarching(pos,dir,esp).y;
	return step(esp,d);
}

void main( void ) {
	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / resolution.y;
	vec2 touch = (2.0*mouse-1.0)*resolution.xy/resolution.y;
		
	vec3 ro = vec3(-10.0*touch,50.0)+28.0*Y-10.0*X;
	vec3 rd = setCamera(uv,ro,ZERO,Y);
	vec3 h = rayMarching(ro,rd,EPSILON);
	vec3 color = ZERO;
	if(h.x < MAX_DIST){
		for(int i = 0; i< MAX_LIGHT;i++){
		vec3 Lo = ZERO;
		float t = 0.2 * time;
		vec3 light = 18.0*vec3(sin(t*float(i)),0.3,cos(float(i)*t));
		vec3 pos = ro+rd*h.x;
		
		float row = floor(h.y / BALL_COL);
		float col = h.y - row * BALL_COL;
		float k = smoothstep(0.4,0.7,fbm3(pos));
		float id = step(0.0,h.z);
		vec3 albedo = mix(vec3(1.0),mix(ALBEDO,vec3(0.69,0.05,0.0),1.0-k),id);
		float roughness = ROUGHNESS*(1.0-k)*id+0.2;//*(row+1.0)/BALL_ROW;
		float metallic = METALLIC*(k)*id+0.2;//*(col+1.0)/BALL_COL;
		
		vec3 N = calcNormal(pos);//+(1.0-k)*vec3(k,fbm3(pos+Y),fbm3(pos-X));
		vec3 L = normalize(light-pos);
		vec3 V = normalize(ro-pos);
		vec3 H = normalize(V+L);
		
		vec3 F  = fresnelSchlick(albedo,max(dot(H, V), 0.0),metallic);
		float NDF = DistributionGGX(N, H, roughness);       
		float G   = GeometrySmith(N, V, L, roughness);
		
		float dis = 1.0;//length(light-pos);
        	float attenuation = 1.0 / (dis * dis);
        	vec3 radiance     = vec3(1.0,1.0,1.0) * attenuation;

		vec3 nominator  = NDF * G * F;
		float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.001; 
		vec3 specular     = nominator / denominator;
		vec3 kS = F;
		vec3 kD = vec3(1.0) - kS;
		kD *= 1.0 - metallic; 
		float NdotL = max(dot(N, L), 0.0);        
   		Lo += (kD * albedo / PI + specular) * radiance * NdotL;
		vec3 ambient = vec3(0.03) * albedo * AO ;
		color += ambient + Lo * softShadow(pos,L,0.1,16.0);  
		}
		color = color / (color + vec3(1.0));
		color = pow(color, vec3(1.0/2.2)); 
	}
	
	gl_FragColor = vec4(color, 1.0);
}