/*
 * Original shader from: https://www.shadertoy.com/view/ltcXDn
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
// Created by Unix 2016
// Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

float marchCount;

float cylinder( vec3 p )
{
    return length( p.xy ) - 0.9;
}

vec3 opTwist( vec3 p )
{
    float a = -0.1 * sin(iTime) - 0.03 * p.z * sin(p.x+iTime/100.);
    float b = -0.1 * iTime - 0.02 * p.z;
    float c = cos( a );
    float s = sin( a );
    mat2 m = mat2( c, -s, s, c );
    return vec3( m * p.xy, p.z );
}

vec2 opRep( vec2 p, float size, float start, float stop )
{
    float halfSize = size * 0.5;
    vec2 c = floor( p / size );
    p = mod( p, size ) - halfSize;    
    return p;
}

float map( vec3 p )
{
    p = opTwist( p );
    //p.xy = opRep( p.xy, 10.0, -7.0, 7.0 );
    p.xy = opRep( p.xy, 3.0, -7.0, 7.0 );
    float d = cylinder( p );
    return d;
}

float scene( vec3 ro, vec3 rd )
{
    float t = 0.01;
    marchCount = 0.0;
    for ( int i = 0; i < 150; i++ )
    {
        vec3 p = ro + t * rd;
        float d = map( p );
        if ( d < 0.001 )
        {
            return t;
        }
        t += d;
        marchCount+= 1.0/d*0.1;
    }
    return -1.0;
}

vec3 calcNormal( vec3 pos )
{
    vec3 eps = vec3( 0.001, 0.0, 0.0 );
    float pd = map( pos );
    vec3 n = vec3(
            pd - map( pos - eps.xyy ),
            pd - map( pos - eps.yxy ),
            pd - map( pos - eps.yyx ) );
    return normalize( n );
}

float calcAo( vec3 pos, vec3 n )
{
    float occ = 0.0;
    for ( int i = 0; i < 5; i++ )
    {
        float hp = 0.1 + 2.0 * float( i );
        float dp = map( pos + n * hp );
        occ += ( hp - dp );
    }
    return clamp( 1.0 - 0.04 * occ, 0.0, 1.0 );
}

vec3 render( vec3 ro, vec3 rd )
{
    float d = scene( ro, rd );
    vec3 col = vec3( 0 );
    if ( d > 0.0 )
    {
        vec3 pos = ro + d * rd;
        vec3 twistPos = opTwist( pos );
        float t = -5.0 * iTime;
        col = vec3( floor( 0.2 * mod( twistPos.z + t, 6.0 ) ) );
        vec3 nor = calcNormal( pos );
        float ao = calcAo( pos, nor );
        col *= vec3( ao );
        float fog = ( 400.0 + pos.z ) / 300.0;
        col *= fog;
    }
	return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 eye = vec3( 0.0, 0.0, 20.0 );
    vec3 target = vec3( 0.0 );
    vec3 cw = normalize( target - eye );
    vec3 cu = cross( cw, vec3( 0, 1, 0 ) );
    vec3 cv = cross( cu, cw );
    mat3 cm = mat3( cu, cv, cw );

    vec3 col = vec3( 0.0 );
    
    for ( int i = 0; i < 10; i++ )
    {
        vec2 off = vec2( mod( float( i ), 2.0 ), mod( float( i / 2 ), 2.0 ) ) / 2.0;
        vec2 uv = ( fragCoord.xy + off - 0.5 * iResolution.xy ) / iResolution.y;
        vec3 rd = cm * normalize( vec3( uv, 2.5 ) );
        col += render( eye, rd );
    }
    col *= 0.15;
	// This is the glow
    col += marchCount * vec3(0.2, 1.0, 0.41) * 0.0005;
    fragColor = vec4( col, 1.0 );
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}