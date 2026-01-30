/*
 * Original shader from: https://www.shadertoy.com/view/7lKSDz
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define time iTime

const float PI = 3.1415925358;

float safety_sin( in float x ) { return sin( mod( x, PI ) ); }

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}

float rand( vec2 p ) { return fract( sin( dot(p, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 + time * .35 ); }

float noise (in vec2 st) {
	st.xy+=time;
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

float star_burst( vec2 p )
{
	float k0 = 2.0;
	float k1 = 1.0;
	float k2 = 0.5;
	float k3 = 12.0;
	float k4 = 12.0;
    float k5 = 2.0;
    float k6 = 5.2;
    float k7 = 4.0;
    float k8 = 6.2;
	
	float l  = length( p );
    float l2 = pow( l * k1, k2 );
	float n0 = noise( vec2( atan(  p.y,  p.x ) * k0, l2 ) * k3 );
	float n1 = noise( vec2( atan( -p.y, -p.x ) * k0, l2 ) * k3 );
	float n  = pow( max( n0, n1 ), k4 ) * pow( clamp( 1.0 - l * k5, 0.0, 1.0 ), k6 );
	n += pow( clamp( 1.0 - ( l * k7 - 0.1 ), 0.0, 1.0 ), k8 );
	return n;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 p = fragCoord / min( iResolution.x, iResolution.y );
    
    p -= 0.5; p.x -= 0.35;
    p *= 0.5;
    
	float r = star_burst( p * 1.1 );
	float g = star_burst( p );
	float b = star_burst( p * 0.9 );

    // Output to screen
    vec3 col = pow( vec3( r, g, b ), vec3( 1.0 / 2.2 ) );
    fragColor = vec4( col, 1.0 );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}