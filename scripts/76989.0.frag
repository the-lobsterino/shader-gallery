/*
 * Original shader from: https://www.shadertoy.com/view/7dXGD8
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
#define r(x) fract(sin(x*12.9898)* 43758.5453123)
#define rs(x) (r(x)*2.-1.)
#define t iTime
#define NOCLIP false
#define I 7

float lineWidth = 0.;

#define glow(x,f) (1. - pow(smoothstep(0.,(f)*lineWidth,abs(x)),0.2))

// Misc Functions

void pR(inout vec2 p,float a) {
	p=cos(a)*p+sin(a)*vec2(p.y,-p.x);
}

vec3 pal(float t) {
	return (0.5+0.5*cos(3.*(1.*t+vec3(0,0.33,0.67))));
}

// 2D Functions

// IQ's distance to line segment
float sdSegment2( vec2 p, vec2 a, vec2 b ) {
  vec2 pa = p-a, ba = b-a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h );
}

vec3 get2dColor( vec2 p ) {
  vec3 color = vec3(0), c; float d, md=1e2;
  vec4 l;
  for( int i=0; i < I; i++ ) {
    float a = r(float(i)+112.);
    l = vec4(rs(a+1.),rs(a+2.1),rs(a+3.8),rs(a+6.7))*2.;
    c = vec3(rs(a+1.),rs(a+2.1),r(a+3.8)*1.5+0.2);
    pR(l.xy, t*l.x);
    pR(l.zw, -t*l.z*0.1);
    d = sdSegment2(p, l.xy, l.zw);
    if(NOCLIP || d<md){ md = d; color += glow(d, 10.) * (0.5+0.5*cos(3.*(1.*length(l.xz)+vec3(0,0.33,0.67)))); }
    c.z *= sin(t*(c.z*c.x*2.1+0.1))*0.5+0.7;
    pR(c.xy,t*c.y);
    d = dot(p-c.xy,p-c.xy) - c.z;
    if(NOCLIP || d<md){ md = d; color += glow( d, 10. ) * (0.5+0.5*cos(3.*(1.*c.z*2.+vec3(0,0.33,0.67)))); }
  }
  return color;
}

void mainImage( out vec4 oc, in vec2 p ) {
  float minD = min(iResolution.x, iResolution.y);
  float maxD = max(iResolution.x, iResolution.y);
  lineWidth = minD*0.0003;
  vec2 st = 2.*(p-iResolution.xy*0.5) / maxD;

  vec3 col = get2dColor( 2.*(st) );

  oc = vec4(col*1.0,1);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}