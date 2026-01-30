#ifdef GL_ES
precision mediump float;
#endif

// afl_ext

// Link to a photo I took long time ago: http://i.imgur.com/UwtnqYN.jpg

// j avascript:void(window.open(get_img(2*1920,2*1200)));
// https://i.imgur.com/HZCORJW.jpg

#define iGlobalTime time
#define iResolution resolution
#define iMouse mouse


#define HOW_CLOUDY 0.8
#define SHADOW_THRESHOLD 0.5
#define SHADOW 0.2
#define SUBSURFACE 1.0
#define ENABLE_SHAFTS
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define time surfacePosition.x
#define mouse vec2(0.625,.125)

mat2 m = mat2( 0.90,  0.110, -0.70,  1.00 );

float hash( float n )
{
    return fract(sin(n)*718.5453);
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x); 
    //f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + p.z*800.0;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
		    mix(mix( hash(n+800.0), hash(n+801.0),f.x), mix( hash(n+857.0), hash(n+858.0),f.x),f.y),f.z);
    return res;
}

float fbm( vec3 p )
{
    float f = 0.0;
    f += 0.50000*noise( p ); p = p*1.;
    f -= 0.25000*noise( p ); p = p*2.;
    f += 0.12500*noise( p ); p = p*3.;
    f += 0.06250*noise( p ); p = p*4.;
    f -= 0.03125*noise( p ); p = p*5.;
    f += 0.02125*noise( p ); p = p*7.;
    f += 0.01125*noise( p ); p = p*11.;
    f += 0.00125*noise( p );
    return f/0.984375;
}

float cloud(vec3 p)
{
	p-=fbm(vec3(p.x,p.y,0.0)*0.5)*2.25;
	
	float a =0.0;
	a-=fbm(p*3.0)*2.2-1.1;
	if (a<0.0) a=0.0;
	a=a*a;
	return a;
}

float shadow = 3.0;


float clouds(vec2 p){
	p.x += 2.3;
	p *= .5;
	p += vec2(.12,-.22);
	float ic = cloud(vec3(p * 2.0, iGlobalTime*0.01)) / HOW_CLOUDY;
	float init = smoothstep(0.1, 1.0, ic) * 10.0;
	shadow = smoothstep(0.0, SHADOW_THRESHOLD, ic) * SHADOW + (1.0 - SHADOW);
	init = (init * cloud(vec3(p * (11.0), iGlobalTime*0.04)) * ic);
	init = (init * (cloud(vec3(p * (111.0), iGlobalTime*0.04))*0.5 + 0.4) * init);
	return min(1.0, init);
}
float cloudslowres(vec2 p){
	float ic = cloud(vec3(p * 2.0, iGlobalTime*0.01)) / HOW_CLOUDY;
	float init = smoothstep(0.1, 1.0, ic) * 10.0;
	return min(1.0, init);
}

vec2 ratio = vec2(iResolution.x / iResolution.y, 1.0);

vec3 getresult(){
	vec2 position = ( gl_FragCoord.xy / iResolution.xy );
	vec2 sun = iMouse;
	float dst = distance(sun * ratio, position * ratio);
	float suni = pow(1.0 / (dst + 1.0), 5.0);
	float shaft =0.0;
	float st = 1.0;
	vec2 dir = sun * ratio - position * ratio;
	float c = clouds(position * ratio);
	#ifdef ENABLE_SHAFTS
	for(int i=0;i<20;i++){
		float occl = cloudslowres((position * ratio) + dir * st);
		st *= 0.3;
		shaft += occl * (1.0 - st);
	}
	suni *= shaft * 0.05 * 1.7;
	#endif
	return mix(vec3(1.0) * (shadow + suni * suni * 0.2 * SUBSURFACE), vec3(0.23, 0.33, 0.48) + suni, c);	
}
void main( void ) {
	gl_FragColor = vec4(getresult().xyz,1);
}