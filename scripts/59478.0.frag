// JADIS

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

#define SHADOW_THRESHOLD 1.0
#define SHADOW 1.0
#define SUBSURFACE 1.0
#define WIND_DIRECTION 5.0
#define SCALE 0.1

#define iGlobalTime (time + mouse.x * 1000.0)
#define iMouse (mouse.xy * resolution.xy)
#define iResolution resolution

#define TIME_SCALE (0.2)
#define HOW_CLOUDY 0.04
mat2 RM = mat2(cos(WIND_DIRECTION), -sin(WIND_DIRECTION), sin(WIND_DIRECTION), cos(WIND_DIRECTION));
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash( float n )
{
    return fract(sin(n)*758.5453);
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x); 
    float n = p.x + p.y*57.0 + p.z*800.0;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
		    mix(mix( hash(n+800.0), hash(n+801.0),f.x), mix( hash(n+857.0), hash(n+858.0),f.x),f.y),f.z);
    return res;
}

float hash2( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float oct(vec3 p){
    return fract(4768.1232345456 * sin((p.x+p.y*43.0+p.z*137.0)));
}
float achnoise(vec3 x){
    vec3 p = floor(x);
    vec3 fr = smoothstep(0.0, 1.0, fract(x));
    vec3 LBZ = p + vec3(0.0, 0.0, 0.0);
    vec3 LTZ = p + vec3(0.0, 1.0, 0.0);
    vec3 RBZ = p + vec3(1.0, 0.0, 0.0);
    vec3 RTZ = p + vec3(1.0, 1.0, 0.0);

    vec3 LBF = p + vec3(0.0, 0.0, 1.0);
    vec3 LTF = p + vec3(0.0, 1.0, 1.0);
    vec3 RBF = p + vec3(1.0, 0.0, 1.0);
    vec3 RTF = p + vec3(1.0, 1.0, 1.0);

    float l0candidate1 = oct(LBZ);
    float l0candidate2 = oct(RBZ);
    float l0candidate3 = oct(LTZ);
    float l0candidate4 = oct(RTZ);

    float l0candidate5 = oct(LBF);
    float l0candidate6 = oct(RBF);
    float l0candidate7 = oct(LTF);
    float l0candidate8 = oct(RTF);

    float l1candidate1 = mix(l0candidate1, l0candidate2, fr[0]);
    float l1candidate2 = mix(l0candidate3, l0candidate4, fr[0]);
    float l1candidate3 = mix(l0candidate5, l0candidate6, fr[0]);
    float l1candidate4 = mix(l0candidate7, l0candidate8, fr[0]);


    float l2candidate1 = mix(l1candidate1, l1candidate2, fr[1]);
    float l2candidate2 = mix(l1candidate3, l1candidate4, fr[1]);


    float l3candidate1 = mix(l2candidate1, l2candidate2, fr[2]);

    return l3candidate1;
}

float supernoise3d(vec3 p){

	float a =  achnoise(p);
	float b =  achnoise(p + 10.5);
	return (a + b) * 0.5;
}

float fbm(vec3 p){
    	float a = 0.0;
    	float w = 0.5;
	for(int i=0;i<20;i++){
		a += supernoise3d(p) * w;
        	w *= 0.5;
		p *= 2.8;
	}
	return a * 0.5;
}
float cloud(vec3 p)
{
	p-=fbm(vec3(p.x,p.y,0.0)*0.5)*1.55;
	p += fbm(p * 200.0) * 0.05;
	float a = fbm(p*3.0);
	return a;
}

float shadow = 1.0;


float clouds(vec2 p){
	float icx = cloud(vec3(p * 2.0, iGlobalTime*0.01 * TIME_SCALE));
	float ic = icx / HOW_CLOUDY;
	float init = smoothstep(HOW_CLOUDY - 0.1, HOW_CLOUDY + 0.1, icx);
	shadow = (icx*icx) * SHADOW + (1.0 - SHADOW);
	init = (init * cloud(vec3(p * (6.0), iGlobalTime*0.01 * TIME_SCALE)) * ic);
	init = (init * (cloud(vec3(p * (11.0), iGlobalTime*0.01 * TIME_SCALE))*0.5 + 0.4) * init);
	return min(1.0, init);
}

vec2 ratio = vec2(100.0, 78.0);
vec3 aces_tonemap(vec3 color){	
	mat3 m1 = mat3(
        0.59719, 0.07600, 0.02840,
        0.35458, 0.90834, 0.13383,
        0.04823, 0.01566, 0.83777
	);
	mat3 m2 = mat3(
        1.60475, -0.10208, -0.00327,
        -0.53108,  1.10813, -0.07276,
        -0.07367, -0.00605,  1.07602
	);
	vec3 v = m1 * color;    
	vec3 a = v * (v + 0.0245786) - 0.000090537;
	vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
	return pow(clamp(m2 * (a / b), 0.0, 1.0), vec3(1.0 / 2.2));	
}

float rand2sTime(vec2 co){
    co *= time;
    return fract(sin(dot(co.xy,vec2(42.9898,78.233))) * 43758.5453);
}
vec3 getresult(){
	vec2 surfacePosition = ((( gl_FragCoord.xy / iResolution.xy ) * vec2(iResolution.x / iResolution.y, 1.0)) * 2.0 - 1.0)*SCALE;
	vec2 position = RM*( surfacePosition);

	float suni = pow(1.0, 50.0);

	float c = clouds(position * 0.6);
        //shadow = min(1.0, shadow);
        shadow = min(2.0, shadow + (c * 2.0 + 0.8) * suni * suni * 0.9* SUBSURFACE);
	return vec3(rand2sTime(position)) * 0.01 + mix(vec3(shadow) * vec3(0.23, 0.33, 0.48) * 3.8, pow(vec3(0.13 + position.y, 0.23 + position.y, 0.38 + position.y), vec3(2.2)), c) ;		
}
void main( void ) {
	gl_FragColor = vec4(aces_tonemap(getresult()).xyz, 2.0) + vec4(hash2(gl_FragCoord.xy + time)) * (1.0 / 64.0);
}