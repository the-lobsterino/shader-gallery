/*
 * Original shader from: https://www.shadertoy.com/view/wd3SD7
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

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
#define EPS         0.008
#define MAX_DIST   50.0
#define ITERATIONS 75

#define TIME iTime

// ===== https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm =====

float sdTriPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);
    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
}

float sdVesica(vec3 p1, float r, float d1, float h)
{
    
    vec2 p = p1.xy;
    p = abs(p);
    float b = sqrt(r*r-d1*d1);
    float d = ((p.y-b)*d1>p.x*b) ? length(p-vec2(0.0,b))
                             : length(p-vec2(-d1,0.0))-r;
    
    vec2 w = vec2( d, abs(p1.z) - h );
    return min(max(w.x,w.y),0.0) + length(max(w,0.0));
}

// ===================================================================================

mat2 rot( float theta )
{
    float c = cos(theta);
    float s = sin(theta);
    return mat2( c, s, -s, c );
}

float eyeHole( vec3 p, float theta )
{    
    p.yz *= rot(-.2);
    p.xz *= rot(theta);
    p.xy *= rot(.1*sign(theta));
    return sdTriPrism( p - vec3(0, 0, 2.5), vec2(.5,.5) );
}

float tooth( vec3 p, float a, float b, float c )
{
    p.yz *= rot(a);
    p.xz *= rot(b);
    p.xy *= rot(c);
    return sdTriPrism( p - vec3(0, 0, 2.5), vec2(.25,.5) );
}

float noseHole( vec3 p )
{
	return sdTriPrism( p - vec3(0, 0, 2.5), vec2(.25,.5) );   
}

float mouthHole( vec3 p )
{
    p.y -= .4*p.x*p.x;
    
    p.yz *= rot(.27);
    p.xy = p.yx;
    return sdVesica( p - vec3(0, 0, 2.5), 3.1, 2.8, .7 );
}

float hollow( vec3 p )
{
    vec2 q = vec2( length( p.xz ) - 1.1, p.y );
    float d = length( q ) - 1.1;
    return d;
}

float centerSphereHole( vec3 p )
{
    return length( p ) - .5;
}

float gourd( vec3 p )
{
    vec2 q = vec2( length( p.xz ) - 1.1, p.y );
    float d = length( q ) - 1.5;
    
    float theta = atan( p.z, p.x );   
    d -= .05*abs(sin( 12.* theta ));
    
    d += .02*texture( iChannel1, p ).r;
    d += .1*texture( iChannel1, p*.1 ).r;
    
    return d;
}

float map( vec3 p )
{
    float holes = min( eyeHole( p, 0.3 ), eyeHole( p, -0.3 ) );
    holes = min( holes, noseHole( p ));
    holes = min( holes, mouthHole( p ) );
    holes = max( holes, -tooth( p, .16, .15, 1. ) );
    holes = max( holes, -tooth( p, .31, -.2, .4 ) );
    holes = min( holes, centerSphereHole( p ) );
    
    return
        max(
            max( gourd( p ), -holes ),
            -hollow( p )
        );
}

float flicker()
{
    return texture( iChannel1, vec3( .15*TIME, 0, 0 )).r;
}

struct March
{
    vec3 pos;
    float dist;
    float ao;
};
    
March march( vec3 ro, vec3 rd )
{
    float dist, totalDist = 0.0;
    
    int i = 0;
    for(int ii = 0; ii < ITERATIONS; ++ii )
    {
        dist = map( ro );
        totalDist += dist;
        if( dist < EPS || totalDist > MAX_DIST ) break;
        ro += rd * dist;        
        ++i;
    }

    return March( ro, dist < EPS ? totalDist : -1.0, float(i) / 100. );
}

const vec3 SHELL_COLOR = vec3(252, 138, 21) / 255.;
const vec3 INNER_COLOR = vec3(253, 180, 75) / 255.;
const vec3 GLOW_COLOR  = vec3(253, 180, 75) / 255.;

vec3 colorize( vec3 pos, float dist, float ao, int material, float insideLevel )
{
    float fog = exp(-1. * (dist - 3.));
    float glow = 0.;
    float bright = .2 + .6*flicker();
    
    vec3 color;
    
    if (material == 0) {
        fog = mix( fog, 1.0, insideLevel );
        glow = insideLevel * 2.*bright;
        color = mix( SHELL_COLOR, INNER_COLOR, smoothstep( .05, .2, insideLevel ) );
    }
    else if (material == 1) {
		color = 2.*texture( iChannel0, pos.xz/ 10. ).rgb * (mix(1.5*GLOW_COLOR,vec3(1),.5) * (.5+.5*bright));
    }
    
    color = color * fog + GLOW_COLOR*glow - ao;
    
    if (material == 0) {
        float l = length( pos.xz );
    	color += .2 * bright * max(0., -pos.y - 1.);
    }
    
    return color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.yy - vec2(.5 * iResolution.x / iResolution.y, .5);
    
    vec3 ro = vec3( 0, 0, 6 );
    vec3 rd = normalize( vec3( uv, -1 ));
    
    float st = sin(TIME*.5);
    float ct = cos(TIME*.4);
    mat2 pitch = rot( .2 * st*st );
    mat2 yaw = rot( .3 * ct );

    ro.xz *= yaw;
    rd.xz *= yaw;
    ro.yz *= pitch;
    rd.yz *= pitch;
    
    March m = march( ro, rd );
    float planeDist = (-1.5 - ro.y) / rd.y;
    
    vec3 pos;
    float dist;
    float ao;
    int material;
    float insideLevel;
    
    if( m.dist >= 0.0 && (planeDist <= 0.0 || m.dist < planeDist) )
    {
        const float MAX_DEPTH = -.5;
        float gourdDepth = gourd( m.pos );
        
        pos = m.pos;
        dist = m.dist;
        material = 0;
        insideLevel = clamp( 1.0 - (gourdDepth - MAX_DEPTH) / (-0.1 - MAX_DEPTH), 0., 1. );
        
        float belowZero = step( pos.y, 0.0 );
        float outsideGourd = 1.0 - step( gourdDepth, -.05 );
        float withFloor = .5*max( 0.,  1. - pow(.45*length(pos.xz), .3));
        float insideCracks = m.ao;
        
        ao = outsideGourd * belowZero * withFloor + .3*insideCracks;        
    }
    else if( planeDist > 0.0 )
    {
        pos = ro + planeDist*rd;
        dist = planeDist;
        float l = length( pos );
        ao = dot(-pos, vec3(0,1,0)) / l/l;
        material = 1;
        insideLevel = 0.0;
        
        ao = max( 0.,  1. - pow(.45*length(pos.xz), .3));
    }
    else
    {
        fragColor = vec4(0);
        return;
    }
    
    fragColor = vec4( colorize( pos, dist, ao, material, insideLevel ), 1 );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}