#ifdef GL_ES
precision mediump float;
#endif

// afl_ext

// Link to a photo I took long time ago: http://i.imgur.com/UwtnqYN.jpg


#define HOW_CLOUDY 0.8
#define SHADOW_THRESHOLD 0.2
#define SHADOW 0.2
#define SUBSURFACE 1.0
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define surfacePosition (surfacePosition*.4+vec2(time*4e-3,0))

mat2 m = mat2( 0.90,  0.110, -0.70,  1.00 );

float hash( float n )
{
    return fract(sin(n)*758.5453);
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
    f += 0.50000*noise( p ); p = p*2.02;
    f -= 0.25000*noise( p ); p = p*2.03;
    f += 0.12500*noise( p ); p = p*2.01;
    f += 0.06250*noise( p ); p = p*2.04;
    f -= 0.03125*noise( p );
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

float shadow = 1.0;


float clouds(vec2 p){
	float ic = cloud(vec3(p * 2.0, time*0.01)) / HOW_CLOUDY;
	float init = smoothstep(0.1, 1.0, ic) * 10.0;
	shadow = smoothstep(0.0, SHADOW_THRESHOLD, ic) * SHADOW + (1.0 - SHADOW);
	init = (init * cloud(vec3(p * (11.0), time*0.04)) * ic);
	return min(1.0, init);
}

void main( void ) {

	vec2 position = surfacePosition;//( gl_FragCoord.xy / resolution.xy );
	#define resolution vec2(1.)
	vec2 sun = mouse;
	float dst = distance(sun * vec2(resolution.x / resolution.y, 1.0), position * vec2(resolution.x / resolution.y, 1.0));
	float suni = pow(1.0 / (dst + 1.0), 5.0);

	float c = clouds(position * (vec2(resolution.x / resolution.y, 1.0)));
	vec3 color = mix(vec3(1.0) * (shadow + suni * suni * 0.2 * SUBSURFACE), vec3(0.23, 0.33, 0.48) + suni, c);
	gl_FragColor = vec4(color.xyzz);
}