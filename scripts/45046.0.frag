//Will Jack @SkrillJam
//shield shader for bombasm
//specail thanks to Brandon Fogerty: check out http://xdpixel.com/energy-field/

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define _Color vec3( 1.0,0.9, 0.4 );
#define _Radius 0.706
#define _Radius2 0.5
#define _PulseSpeed .5
#define _Intensity 1.01
#define _Frequency 30.0


float hash( float n ) { return fract(sin(n)*753.5453123); }

// Slight modification of iq's noise function.
float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    
    float n = p.x + p.y*157.0;
    return mix(
                    mix( hash(n+  0.0), hash(n+  1.0),f.x),
                    mix( hash(n+157.0), hash(n+158.0),f.x),
            f.y);
}

float fbm(vec2 p, vec3 a)
{
     float v = 0.0;
     v += noise(p*a.x)*.5;
     v += noise(p*a.y)*.25;
     v += noise(p*a.z)*.125;
     return v;
}

vec3 WeirdCircle(vec2 uv, float radius, float thickness, float intensity, vec3 fbmOffset, float t2, vec3 color)
{
   float dist = length(uv);
	
    float aTan = atan(uv.y/uv.x); 
    float t1 = intensity *sin(aTan * _Frequency + time *t2) * 0.5 + 0.5 + fbm(uv,fbmOffset) * 0.15; // weird scaling going on here 
    float warp = mix(0.0, 0.5, t1); 
	 
    float effector = thickness*abs(0.003/((dist) - (radius + warp))); // the effector dithers out the color so it looks lasery. 
	
    return color * effector;
    
}


void main( void )
{

    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x /resolution.y;

    vec3 finalColor = vec3( 0.0 );

    finalColor += WeirdCircle(uv, _Radius, 1.0, _Intensity, vec3( 200, 100, 50),-10.0,vec3( 0.3, 0.5, 2.5 ));
    finalColor += WeirdCircle(uv, _Radius, 1.0, _Intensity, vec3( 90, 15, 1),1.0,vec3( 0.8,0.5, 0.0 ));
    finalColor += WeirdCircle(uv, _Radius2, 1.0, _Intensity , vec3(30, 6, 5),5.0, vec3( 2.3, 0.5, .5 ));
    finalColor += WeirdCircle(uv, _Radius2-0.04, 1.0, _Intensity * 2.0, vec3(100,100,100),4.0,vec3( 0.12, 0.15, 2.1 ));
    finalColor += WeirdCircle(uv, _Radius2-0.1, 0.1, _Intensity , vec3(200,200,200),4.0,vec3( 0.1, 0.1, 0.2 ));
    gl_FragColor = vec4( finalColor, 1.0);
}