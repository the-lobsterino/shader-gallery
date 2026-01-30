#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float hash( float n ){
    return fract(sin(n)*758.5453);
    //return fract(mod(n * 2310.7566730, 21.120312534));
}

float noise3d( in vec3 x ){
	vec3 p = floor(x);
	vec3 f = fract(x);
	f       = f*f*(3.0-2.0*f);
	float n = p.x + p.y*157.0 + 113.0*p.z;

	return mix(mix(	mix( hash(n+0.0), hash(n+1.0),f.x),
			mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
		   mix(	mix( hash(n+113.0), hash(n+114.0),f.x),
			mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

float noise2d( in vec2 x ){
    vec2 p = floor(x);
    vec2 f = smoothstep(0.0, 1.0, fract(x));
    float n = p.x + p.y*57.0;
    return mix(mix(hash(n+0.0),hash(n+1.0),f.x),mix(hash(n+57.0),hash(n+58.0),f.x),f.y);
}

 float configurablenoise(vec3 x, float c1, float c2) {
	vec3 p = floor(x);
	vec3 f = fract(x);
	f       = f*f*(3.0-2.0*f);

	float h2 = c1;
	 float h1 = c2;
	#define h3 (h2 + h1)

	 float n = p.x + p.y*h1+ h2*p.z;
	return mix(mix(	mix( hash(n+0.0), hash(n+1.0),f.x),
			mix( hash(n+h1), hash(n+h1+1.0),f.x),f.y),
		   mix(	mix( hash(n+h2), hash(n+h2+1.0),f.x),
			mix( hash(n+h3), hash(n+h3+1.0),f.x),f.y),f.z);

}

float supernoise3d(vec3 p){

	float a =  configurablenoise(p, 883.0, 971.0);
	float b =  configurablenoise(p + 0.5, 113.0, 157.0);
	return (a + b) * 0.5;
}
float supernoise3dX(vec3 p){

	float a =  configurablenoise(p, 883.0, 971.0);
	float b =  configurablenoise(p + 0.5, 113.0, 157.0);
	return (a * b);
}

float fbm( vec3 p )
{
    float f = 0.0;
    f += 0.50000*supernoise3d( p ); p = p*2.02;
    f -= 0.25000*supernoise3d( p ); p = p*2.03;
    f += 0.12500*supernoise3d( p ); p = p*3.01;
    f += 0.06250*supernoise3d( p ); p = p*3.04;
    f += 0.03500*supernoise3d( p ); p = p*4.01;
    f += 0.01250*supernoise3d( p ); p = p*4.04;
    f -= 0.00125*supernoise3d( p );
    return f/0.984375;
}

float cloud(vec3 p)
{
	p-=fbm(vec3(p.x,p.y,0.0)*0.5)*1.25;
	float a = min((fbm(p*3.0)*2.2-1.1), 0.0);
	return a*a;
}

float shadow = 1.0;


#define HOW_CLOUDY 0.4
#define SHADOW_THRESHOLD 0.2
#define SHADOW 0.2
#define SUBSURFACE 1.0
#define WIND_DIRECTION 2.0
#define TIME_SCALE 0.7
#define SCALE 0.5
float clouds(vec2 p){
	float ic = cloud(vec3(p * 2.0, time*0.01 * TIME_SCALE)) / HOW_CLOUDY;
	float init = smoothstep(0.1, 1.0, ic) * 10.0;
	shadow = smoothstep(0.0, SHADOW_THRESHOLD, ic) * SHADOW + (1.0 - SHADOW);
	init = (init * cloud(vec3(p * (6.0), time*0.01 * TIME_SCALE)) * ic);
	init = (init * (cloud(vec3(p * (11.0), time*0.01 * TIME_SCALE))*0.5 + 0.4) * init);
	return min(1.0, init);
}
// THIS
// THIS IS PERFECT
vec3 getScatterColor(float dist, float mie){ 
	vec3 color = vec3(0.03, 0.06, 0.1) * dist;
	return max(pow(color, (1.0 - mie)-color), 0.0);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.y); 
	vec2 miecoord = position;
	miecoord.x = miecoord.x * 2.0 - 1.0;
	miecoord.x /= position.y + 0.1;
	miecoord.x *= 0.1;
	float mie = clouds(miecoord * 3.0);
	
	gl_FragColor = vec4(getScatterColor(3.14 / position.y, mie), 1.0 );

}