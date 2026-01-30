#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int _VolumeSteps = 16;
const float _StepSize = 0.1; 
const float _Density = 0.25;

const float _SphereRadius = 0.5;
const float _NoiseFreq = 3.0;
const float _NoiseAmp = 1.;

const vec3 _NoiseAnim = vec3(-0.50, -2.0, -2.0);


mat3 m = mat3( 0.00,  0.80,  0.60,
              -0.80,  0.36, -0.48,
              -0.60, -0.48,  0.64 );

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}


float sqlen(in vec3 p)
{
    return (p.x*p.x+p.y*p.y+p.z*p.z);
}


float udRoundBox( in vec3 p, in vec3 b, in float r )
{
	return length(max(abs(p)-b,0.0))-r;
}


float opU( in float d1, in float d2 )
{
	return min(d1,d2);
}

vec3 translate( in vec3 v, in vec3 t )
{
	return v - t;
}

float cr( in vec3 pos )
{
    
    pos*=3.;
    pos.y=1.0-pos.y;
    pos.y+=3.;

	vec4 boxd1 = vec4( 0.5, 3.5, 0.5, 0.25 ); // sxyz, r
	vec4 boxp1 = vec4( 0.0, 3.5, 0.0, 0.0 ); // xyz, 0
	boxd1.xyz -= boxd1.w;
	
	vec4 boxd2 = vec4( 3.0, 0.5, 0.5, 0.25 ); // sxyz, r
	vec4 boxp2 = vec4( 0.0, 4.5, 0.0, 0.0 ); // xyz, 0
	boxd2.xyz -= boxd2.w;
	
	
	float d = 9999.0;
	
	d = opU( d, udRoundBox( translate( pos, boxp1.xyz ), boxd1.xyz, boxd1.w ) );
	d = opU( d, udRoundBox( translate( pos, boxp2.xyz ), boxd2.xyz, boxd2.w ) );

	return d;
}


float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*57.0 + 113.0*p.z;

    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    return res;
}

float fbm( vec3 p )
{
    float f;
    f = 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
	
    return f;
}


float distanceFunc(vec3 p)
{	
	float d = sqlen(p) - _SphereRadius;	
  
	d += fbm(vec3(p.x,p.y,p.z)*_NoiseFreq + _NoiseAnim*time) * _NoiseAmp;
    d = min(d,cr(p));
	return d;
}

vec4 gradient(float x)
{
	const vec4 c0 = vec4(2, 2, 1, 1);	
	const vec4 c1 = vec4(1, 0, 0, 1);
	const vec4 c2 = vec4(0, 0, 0, 0); 
	const vec4 c3 = vec4(0, 0.5, 1, 0.5); 
	const vec4 c4 = vec4(0, 0, 0, 0); 	
	
	x = clamp(x, 0.0, 0.999);
	float t = fract(x*4.0);
	vec4 c;
	if (x < 0.25) {
		c =  mix(c0, c1, t);
	} else if (x < 0.5) {
		c = mix(c1, c2, t);
	} else if (x < 0.75) {
		c = mix(c2, c3, t);
	} else {
		c = mix(c3, c4, t);		
	}

	return c;
}


vec4 shade(float d)
{	

	return gradient(d);
}


vec4 volumeFunc(vec3 p)
{
	float d = distanceFunc(p);
	return shade(d);
}


vec4 rayMarch(vec3 rayOrigin, vec3 rayStep, out vec3 pos)
{
	vec4 sum = vec4(0, 0, 0, 0);
	pos = rayOrigin;
	for(int i=0; i<_VolumeSteps; i++) {
		vec4 col = volumeFunc(pos);
		col.a *= _Density;

		col.rgb *= col.a;
		sum = sum + col*(1.0 - sum.a);	
#if 0
	
        	if (sum.a > 1.0)
            		break;
#endif		
		pos += rayStep;
	}
	return sum;
}

void main()
{
    vec2 p = (gl_FragCoord.xy / resolution.xy)*2.0-1.0;
    p.x *= resolution.x/ resolution.y;
  p.y+=0.125;
	
    float rotx = 1.5;//+( mouse.y )*1.0;
    float roty = 1.5;//1.0-(mouse.x )*2.0;

    float zoom = 2.50;


    vec3 ro = zoom*normalize(vec3(cos(roty), cos(rotx), sin(roty)));
    vec3 ww = normalize(vec3(0.0,0.0,0.0) - ro);
    vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

    ro += rd*2.0;
	

    vec3 hitPos;
    vec4 col = rayMarch(ro, rd*_StepSize, hitPos);

	    
    gl_FragColor = col;
}
