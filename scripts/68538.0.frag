
// BREXIT
#ifdef GL_ES
precision highp float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
 
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){
	p.y+=1.75*CHS;
	d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));
	p+=vec2(0.5,-3.25)*CHS;
	return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} 
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT
 
float GetText(vec2 uv)
{
	uv.x += 2.75;
	
	float v = 0.5+sin(time*2.0)*0.5;
	v*=7.0;
	float t = mod((v),7.0);
	float d = 2000.0;
	
		d = B(uv,1.0);uv.x -= 1.1;
		d = R(uv,d);uv.x -= 1.1;
		d = E(uv,d);uv.x -= 1.1;
		d = X(uv,d);uv.x -= 1.1;
		d = I(uv,d);uv.x -= 1.1;
		d = T(uv,d);
	return smoothstep(0.0,0.15,d-0.55*CHS);
}
 



/*
 * Original shader from: https://www.shadertoy.com/view/wsVyzw
 */

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
const float zoom = 3.;
const float lineWeight = 4.3;
const bool invertColors = true;
const float sharpness = 0.2;

const float StarRotationSpeed = -.5;
const float StarSize = 1.8;
const int StarPoints = 3;
const float StarWeight = 3.4;

const float waveSpacing = .3;
const float waveAmp = .4;
const float waveFreq = 25.;
const float phaseSpeed = .33;


const float waveAmpOffset = .01; // just a little tweaky correction

mat2 rot2D(float r){
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

// signed distance to a n-star polygon with external angle en
float sdStar(in vec2 p, in float r, in int n, in float m) // m=[2,n]
{
    // these 4 lines can be precomputed for a given shape
    float an = 3.141593/float(n);
    float en = 3.141593/m;
    vec2  acs = vec2(cos(an),sin(an));
    vec2  ecs = vec2(cos(en),sin(en)); // ecs=vec2(0,1) and simplify, for regular polygon,

    // reduce to first sector
    float bn = mod(atan(p.x,p.y),2.0*an) - an;
    p = length(p)*vec2(cos(bn),abs(sin(bn)));

    // line sdf
    p -= r*acs;
    p += ecs*clamp( -dot(p,ecs), 0.0, r*acs.y/ecs.y);
    return length(p)*sign(p.x);
}
float sdShape(vec2 uv) {
    uv *= rot2D(-iTime*StarRotationSpeed);
    return sdStar(uv, StarSize, StarPoints, StarWeight);
}

// https://www.shadertoy.com/view/3t23WG
// Distance to y(x) = a + b*cos(cx+d)
float udCos( in vec2 p, in float a, in float b, in float c, in float d )
{
    // convert all data to a primitive cosine wave
    p = c*(p-vec2(d,a));
    
    // reduce to principal half cycle
    const float TPI = 6.28318530718;
    p.x = mod( p.x, TPI); if( p.x>(0.5*TPI) ) p.x = TPI - p.x;

    // find zero of derivative (minimize distance)
    float xa = 0.0, xb = TPI;
    for( int i=0; i<7; i++ ) // bisection, 7 bits more or less
    {
        float x = 0.5*(xa+xb);
        float si = sin(x);
        float co = cos(x);
        float y = x-p.x+b*c*si*(p.y-b*c*co);
        if( y<0.0 ) xa = x; else xb = x;
    }
    float x = 0.5*(xa+xb);
    for( int i=0; i<4; i++ ) // newtown-raphson, 28 bits more or less
    {
        float si = sin(x);
        float co = cos(x);
        float  f = x - p.x + b*c*(p.y*si - b*c*si*co);
        float df = 1.0     + b*c*(p.y*co - b*c*(2.0*co*co-1.0));
        x = x - f/df;
    }
    
    // compute distance    
    vec2 q = vec2(x,b*c*cos(x));
    return length(p-q)/c;
}

vec3 dtoa(float d, in vec3 amount){
    return 1. / clamp(d*amount, amount/amount, amount);
}

// 4 out, 1 in...
vec4 hash41(float p)
{
	vec4 p4 = fract(vec4(p) * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
void mainImage( out vec4 o, vec2 C, float d)
{
    vec2 R = iResolution.xy;
    vec2 N2 = C/R;
    vec2 N = C/R-.5;
    vec2 uv = N;
    uv.x *= R.x/R.y;
    float t = iTime * phaseSpeed;
    
    uv *= zoom;

    float a2 = 1e5;
    vec2 uvsq = uv;
    float a = 1.+sin(time)-sin(time)*(d+.15)*1.5;//sdShape(uvsq);
    vec2 uv2 = uv;

   // uv.y = mod(uv.y, waveSpacing) - waveSpacing*.5;
    
    for (float i = -3.; i <= 3.; ++ i) { // necessary to handle overlapping lines. if your lines don't overlap, may not be necessary.
    	vec2 uvwave = vec2(uv2.x, uv.y + i * waveSpacing);
        float b = (smoothstep(1., -1.,a)*waveAmp)+ waveAmpOffset;
        float c = waveFreq;
    	a2 = min(a2, udCos(uvwave, 0., b, c, t));// a + b*cos(cx+d)
    }
    
	vec3 tint = vec3(1.,.5,.4);
    float sh = mix(100., 1000., sharpness);
    o.rgb = dtoa(mix(a2, a-lineWeight + 4., .03), sh*tint);
    if (!invertColors)
	    o = 1.-o;
    o *= 1.-dot(N,N*2.);
    o = clamp(o,vec4(0),vec4(1));
}
// --------[ Original ShaderToy ends here ]---------- //

void main( void )
{
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float rr = rand(sin((abs(p.y)+44.7)*p*fract(time)));
	//rr += abs(sin(time+p.y*121.7))*0.5;
	vec3 col = vec3(0.2*rr);
	//p.y += sin(col.r + time+p.x)*0.1;
	float d= GetText(p*2.0);
	col = mix(col+vec3(.8,.3,.1), col,d);
	gl_FragColor = vec4( col.xyz, 1.0 );
	
    mainImage(gl_FragColor, gl_FragCoord.xy, d);
}