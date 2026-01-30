
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// ----------------------------------------------

float dot2(vec4 v) {return dot(v,v);}

float Grub(vec4 p, vec4 p0, vec4 p1, vec4 p2,vec4 p3, float minDist)
{
    vec4 AA = (p1 * 2.0);
    vec4 BB = (p2 - p0);
    vec4 CC = (p0 * 2.0) - (p1*5.0) + (p2*4.0) - p3;
    vec4 DD = (p1 * 3.0) - (p2*3.0) + p3 - p0;
	
    const float oot = 1./(29.0); // 1/(count - 1)
	
    for( float t = 0.0; t <= 1.0; t += oot )
    {
	float t2 = (t * t);
	float t3 = (t2 * t);
	    
	vec4 sample = (AA + (BB * t) + (CC * t2) + (DD * t3)) * 0.5;
	    
        minDist = min( dot2(sample - p), minDist );
    }
	
    return sqrt(minDist);
}

vec2 Lissajous(float A, float B, float t, float w, float o) 
{
	return vec2( A * sin( w * t + o ), B * sin(t) );
}

// ----------------------------------------------

#define iGlobalTime time
#define iMouse mouse*resolution
#define iResolution resolution

// borrowing the grid lines from 
// https://www.shadertoy.com/view/MtKSDd

vec2 screenToWorld(vec2 coord)
{
   return 2.5 * (2.0 * coord / iResolution.y - vec2(iResolution.x / iResolution.y, 1.0));
}

float round(float a)
{
    return floor(a + 0.5);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = screenToWorld(fragCoord);
	
    vec3 final = vec3(0, 0, 0);
    
    // draw the gridlines
    if (mod(abs(round(uv.x) - uv.x), 1.0) < 0.02)
        final = vec3(0.2, 0.2, 0.2);
    if (mod(abs(round(uv.y) - uv.y), 1.0) < 0.02)
        final = vec3(0.2, 0.2, 0.2);
    
    // draw the axes
    if (uv.x * uv.x < 0.02 * 0.02)
        final = vec3(0.8, 0.8, 0.8);
    if (uv.y * uv.y < 0.02 * 0.02)
        final = vec3(0.8, 0.8, 0.8);
    
    vec2 m = screenToWorld(iMouse.xy);
	
    vec2 lA = Lissajous( 2.0, 1.0, iGlobalTime * 1.5, 1.5, 0.0 );
    vec2 lB = Lissajous( 2.0, 1.0, iGlobalTime * 1.2, 1.5, 0.0 );
	
    vec2 l1 = vec2(2.0,-1.0)+Lissajous( 28.0, 33.0, iGlobalTime * 2.0, 1.0, 3.141592/2.0 );
    vec2 l2 = l1 - Lissajous( 22.0, 17.0, iGlobalTime * 1.5, 1.5, 0.0 );
    
    vec4 p1 = vec4( vec2(0.0).xyxy );
    vec4 p0 = vec4( l1, vec2(0.0) );
    vec4 p2 = vec4( m, vec2(0.0) );
    vec4 p3 = vec4( -l2, vec2(0.0) );

    
    float d = Grub( vec4( uv, vec2(0.0)), p0, p1, p2, p3, 1e10 );
    
    if ( d < 0.5 ) {
        
 	final = vec3( 0.6, 0.7, 0.0 ) * (1.-fract(d*0.5 ));
        
    }
    
    fragColor = vec4(final, 1);
}

void main( void )
{
	mainImage( gl_FragColor, gl_FragCoord.xy );
}