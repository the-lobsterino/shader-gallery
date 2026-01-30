/*
 * Original shader from: https://www.shadertoy.com/view/wddBWf
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iTimeDelta (1./60.)
#define iResolution resolution

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))
int int_mod(int a, int b)
{
    int c = (a - (b * (a/b)));
    return (c < 0) ? c + b : c;
}

// --------[ Original ShaderToy begins here ]---------- //
#define PI 3.1415926

const int SHEET_THICKNESS = 16;

const float END_TIME = 3.6;
const vec3 END_POS = vec3( 7., 49., 2. * float(SHEET_THICKNESS) );


float easeInOutQuad( float x ) 
{
	return x < 0.5 ? 2. * x * x : 1. - pow(-2. * x + 2., 2.) / 2.;
}

float ease01( float t )
{
    t = clamp( t, 0., 1. );
    return t*t*.5; // want slope=1 at t=1
}

float timelineRaw( float t )
{
    float ret = 0.;
    t = mod( t, END_TIME + .2 );
    
    const float EASE_IN_DURATION = .4;
    const float EASE_OUT_DURATION = .4;
    const float LINEAR_DURATION = END_TIME - EASE_IN_DURATION - EASE_OUT_DURATION;
    
    ret += ease01( t / EASE_IN_DURATION ) * EASE_IN_DURATION;
    t -= EASE_IN_DURATION;
    if ( t <= 0. ) return ret;
    
    ret += min( t, LINEAR_DURATION );
    t -= LINEAR_DURATION;
    if ( t <= 0. ) return ret;
    
    ret += ( ease01( 1. ) - ease01( 1. - t / EASE_OUT_DURATION ) ) * EASE_IN_DURATION;
    return ret;
}

float timeline( float t )
{
    return timelineRaw( t ) / timelineRaw( END_TIME ) * END_TIME;
}

vec3 rotY( vec3 p, float angle )
{
    return vec3( p.x * cos(angle) + p.z * sin(angle), p.y, p.x * -sin(angle) + p.z * cos(angle) );
}
vec3 rotX( vec3 p, float angle )
{
    return vec3( p.x, p.y * cos(angle) + p.z * sin(angle), p.y * -sin(angle) + p.z * cos(angle) );
}

int div( int a, int b ) { return a >= 0 ? a/b : (a-b+1)/b; }

int hitLayer( vec3 pos )
{    
    if ( pos.z >= END_POS.z )
        pos.xy -= END_POS.xy;
        
    int pattern = int(floor(pos.z/float(SHEET_THICKNESS))) == 0 ? 0 : 0;
    if ( int(floor(pos.z/float(SHEET_THICKNESS))) == 1 ) pattern = 4;
    
    pos.z += float(SHEET_THICKNESS) * 10.; // just avoid negative z
    
    int x = int( floor( pos.x * 8. ) );
    int y = int( floor( pos.y * 8. ) );
    int z = int_mod( int( round( pos.z ) ) , SHEET_THICKNESS );
        
    int i = z-4;
    if ( i >= 0 && i < 8 )
    	if ( int_mod((div(x,z)+div(y,z)*((int_mod(i,2))==0?-1:1)),8) == int_mod((i+pattern),8) ) return int_mod(i,2);
    
    return -1;
}

float go( vec2 fragCoord, float t )
{
    vec2 uv = (fragCoord - iResolution.xy*.5) / iResolution.y;
    if ( uv.x < -.5 || uv.x >= .5 )
        return .2;
    
    float angle = t/END_TIME*2.*PI;
    float easedAngle = easeInOutQuad(t/END_TIME)*2.*PI;
    //float easedAngle = angle;
    
    float col = .4;
    vec3 startPos = vec3( 0., 0., 0. );
    startPos.z += easeInOutQuad( t/END_TIME ) * float(SHEET_THICKNESS)  * 2. + sin( easeInOutQuad( clamp(t,0.,1.) ) * PI ) * -6.;
    startPos.x += (1. - cos( easedAngle )) * 3. + easeInOutQuad(t/END_TIME) * END_POS.x;
    startPos.y += sin( easedAngle ) * 1. + easeInOutQuad(t/END_TIME) * END_POS.y;
    //startPos.z += ( iMouse.x - iResolution.x * .5 ) * .1;
    //startPos.xy -= ( iMouse.xy - iResolution.xy * .5 ) * .001;
    vec3 pos = startPos;
    vec3 dir = vec3( uv, 1. );
    //dir = rotX( dir, (1.-cos( easedAngle )) * .9 );
    dir = rotX( dir, sin( easedAngle*.5 ) * 1.5 );
    dir = rotY( dir, sin( easedAngle ) * .3 );

    //dir = rotX( dir, sin( angle ) * .8 );
    //dir = rotY( dir, (1.-cos( angle )) * .3 );
    //dir = rotX( dir, ( iMouse.y - iResolution.y * .5 ) * .01 );
    //dir = rotY( dir, ( iMouse.x - iResolution.x * .5 ) * .01 );
    dir /= abs(dir.z);
    
    if ( dir.z >= 0. )
    	pos += ( 1. - fract( pos.z ) ) * dir;    
    else
    	pos += fract( pos.z ) * dir;   
    
    
    for ( int i = 0; i < 60; i++ )
    {
        int c = hitLayer( pos );
        if ( c != -1 )
        {
        	col = float( c );        
        	break;
        }
        pos += dir;
    }
    
    float fog = 1. - pow( .98, length(pos - startPos) - 13. );
    col = mix( col, .5, fog );   
    //col = length(pos - startPos) * .1;
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    fragColor = vec4(.2,.2,.2,1.0);
    vec2 uv = (fragCoord - iResolution.xy*.5) / iResolution.y;
    if ( uv.x < -.5 || uv.x >= .5 )
        return;
    
    const float SPEED = 1.;
    const int BLUR_N = 4;
    
    float colSum = 0.;
    for ( int i = 0; i < BLUR_N; i++ )
    {    
		colSum += go( fragCoord, ( timeline( iTime + iTimeDelta * float(i) / float(BLUR_N) ) ) * SPEED ) / float(BLUR_N);
    }

    fragColor = vec4(vec3(colSum),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}