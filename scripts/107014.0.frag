/*
 * Original shader from: https://www.shadertoy.com/view/3t2SzW
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
// Created by inigo quilez - iq/2019
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.


float sdStick( in vec2 p, in vec2 a, in vec2 b, in float ra, in float rb )
{
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h ) - (ra+(rb-ra)*h*h*(3.0-2.0*h));
}

float sdCircle( in vec2 p, in vec2 c, in float r )
{
    return length(p-c)-r;
}

float sdBox( vec2 p, in vec2 c, vec2 b )
{
    vec2 d = abs(p-c) - b;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

//------------------------------------------------------------

void legAnim( out vec2 ankle, out vec2 knee, out vec2 toes, in vec2 heap, in float t )
{
    float an1 =     - 0.3 + 0.3*cos(t-0.0);
    float an2 = an1 + 0.6 + 0.6*sin(t-0.1);
    float an3 = an2 - 0.4 - 0.6*cos(t-0.5);

    knee  = heap  + 0.32*vec2(cos(an1),sin(an1)); 
    ankle = knee  + 0.30*vec2(cos(an2),sin(an2)); 
    toes  = ankle + 0.27*vec2(cos(an3),sin(an3)); 
}

vec3 diver( in vec3 col, in vec2 p, in float px, float t, float c)
{
    float vt = t - 0.5*cos(t);

    //========================================
    // animate
    //========================================

    // dive
    {
    //p += vec2(0.5,0.1)*vec2(cos(vt),sin(vt)) - vec2(-0.3,0.3);
    p += vec2(-0.5,0.1)*vec2(cos(vt),sin(vt)) - vec2(0.0,0.3);
    }
    
    // jump
    {
    float s = 1.6*exp(-10.0*t);
    float an = s -0.25;
    float co = cos(an), si = sin(an); 
    p = vec2(0.4,1.5) + mat2(co,-si,si,co)*(p-vec2(0.4,1.5));
    }

    // body
    vec2 head = vec2(0.00, 0.10);
    vec2 heap = vec2(0.56, 0.00);
    vec2 shou = vec2(0.18,-0.02);
    vec2 kneeL, ankleL, toesL;
    vec2 kneeR, ankleR, toesR;
	vec2 pp = vec2(0.2, 0.2);
    legAnim( ankleL, kneeL, toesL, heap, 10.0*vt );
    legAnim( ankleR, kneeR, toesR, heap, 10.0*vt+3.14 );

//#if 0
    vec2 elbowL = vec2( 0.05,-0.25);
    vec2 handL  = vec2(-0.16,-0.30);
    vec2 elbowR = vec2( 0.25,-0.25);
    vec2 handR  = vec2( 0.14,-0.40);
//#else
	if(c<1.) {
     elbowL = vec2( 0.40,-0.12);
     handL  = vec2( 0.68,-0.18);
     elbowR = vec2( 0.40,-0.11);
     handR  = vec2( 0.68,-0.14);
	}
//#endif    

    
    //========================================
    // draw
    //========================================
    
    vec2 q = p; // unbent coords
    
    // bend coords
    {
    float an = 0.25*(p.x - 0.5);
    float co = cos(an), si = sin(an); 
    p = mat2(co,-si,si,co)*p;
    }
    
    //-------------------
    
    {
    // arm R
    float d  = sdStick( p, shou,   elbowR, 0.06, 0.04 );
    d = min(d, sdStick( p, elbowR, handR,  0.04, 0.02 ) );
    // leg R
    d = min(d, sdStick( p, heap, kneeR, 0.09, 0.07 ) );
    d = min(d, sdStick( p, kneeR, ankleR, 0.07, 0.04 ) );
    d = min(d, sdStick( p, ankleR, toesR, 0.04, 0.06 ) );
    
    col = mix( col, vec3(0.01,0.03,0.06), 1.0-smoothstep(-px,px,d) );
    }
    
    //-------------------
    {
    // head
    float d  = sdCircle( p, head, 0.11 );
    // tank
	    if(c<1.) {
		    d = min(d, sdBox(    q, vec2(0.48,0.18), vec2( 0.24,0.08) ) );
		    d = min(d, sdCircle( q, vec2(0.24,0.18), 0.08 ) );
	
		    // pp hehe
		    d = min(d, sdBox(    q, vec2(0.64,-0.12), vec2( 0.04,0.16) ) );
		    d = min(d, sdCircle(q, vec2(0.64, -0.25), 0.05));
	    }
    // body
    d = min(d, sdStick( p, vec2(0.2,0.0), vec2(0.56,0.0), 0.11, 0.091 ) );
    // leg L
    d = min(d, sdStick( p, heap,   kneeL,  0.09+c/15., 0.07 ) );
    d = min(d, sdStick( p, kneeL,  ankleL, 0.07, 0.04 ) );
    d = min(d, sdStick( p, ankleL, toesL,  0.04, 0.06 ) );
    // arm L
    d = min(d, sdStick( p, shou,   elbowL, 0.06, 0.04 ) );
    d = min(d, sdStick( p, elbowL, handL,  0.04, 0.02 ) );
 
    col = mix( col, vec3(0.005,0.015,0.03), 1.0-smoothstep(-px,px,d) );
    }
    
    // bubbles
    for( int i=0; i<10; i++ )
    {
        vec2 p0 = head + vec2(-0.15,0.0);
        vec2 p1 = head + vec2( 0.4 + 0.20*sin(21.39*float(i)),0.7);
        float h = fract( 0.85 + 0.5*(t+ 0.5*float(i)*0.12331) );
        vec2 c = mix( p0, p1, h );
        float d = sdCircle( p, c, 0.04*sqrt(h) );
        
        col += (1.0-0.8*sqrt(abs(d)/0.04)) * 0.35 * 4.0*h*(1.0-h)*(1.0-smoothstep(-px,px,d));
    }
    
    return col;
}

vec3 seafloor( in vec3 col, in vec2 p, in float px, in float t )
{
    for( int i=0; i<4; i++ )
    {
        float h = float(i)/3.0;
        float of = -0.4 - 0.4*h + (0.5+0.5*h)*0.1*sin((4.0-h*2.0)*p.x + 30.0*h - 2.5*t*(1.0+2.0*h));
        float dof = 1.0;//3.0 + 5.0*abs(float(i-2));
        col = mix( col, vec3(0.05,0.3,0.5)*(1.0-0.9*h), 1.0-smoothstep(-px*dof, px*dof, p.y-of) );
    }
    return col;
}

vec3 background( in vec2 p )
{
    return vec3(0.05,0.3,0.5)*0.9 + p.y*0.11;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2  p = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    float px = 2.0/iResolution.y;
    
    float ani = iTime*0.2;

    // draw
    vec3 col = background( p );
         col = seafloor( col, p, px, ani );
         col = diver( col, p+vec2(0.132,.330325), px, ani, 1. );
         col = diver( col, p+sin(time*4.)/15., px, ani, 0. );

    // vignetting
	col *= 1.0 - 0.1*dot(p,p);
    
    // gamma
    col = sqrt(col);
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}