/*
 * Original shader from: https://www.shadertoy.com/view/fddXW7
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

// Emulate some GLSL ES ４.x
int int_mod(int a, int b)
{
    int c = (a - (b * (a/b)));
    return (c < 0) ? c + b : c;
}

// --------[ Original ShaderToy begins here ]---------- //
// Inktober 2021 - 02 - suit
// by pali

#define PI 3.141592
#define A 0.4
#define DEPTH 5
#define XREP 8.

#define ndot(x, y) normalize(dot(x, y))

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float triangleIsosceles( in vec2 p, in vec2 q )
{
    p.x = abs(p.x);
    vec2 a = p - q*clamp( dot(p,q)/dot(q,q), 0.0, 1.0 );
    vec2 b = p - q*vec2( clamp( p.x/q.x, 0.0, 1.0 ), 1.0 );
    float s = -sign( q.y );
    vec2 d = min( vec2( dot(a,a), s*(p.x*q.y-p.y*q.x) ),
                  vec2( dot(b,b), s*(p.y-q.y)  ));
    return -sqrt(d.x)*sign(d.y);
}

float rhombus( in vec2 p, in vec2 b ) 
{
    vec2 q = abs(p);
    float h = clamp((-2.0*ndot(q,b)+ndot(b,b))/dot(b,b),-1.0,1.0);
    float d = length( q - 0.5*b*vec2(1.0-h,1.0+h) );
    return d * sign( q.x*b.y + q.y*b.x - b.x*b.y );
}

float heart(vec2 pos)
{
    pos -= vec2(0.1, 0.);
    pos.x /= 0.9;
    pos.y *= 0.9;
    float r = 1e10;
    r = min(r, distance(pos, vec2(0.25, 0.6)) - 0.2);
    r = opSmoothUnion(r, distance(pos, vec2(0.75, 0.6)) - 0.2, 0.05);
    r = opSmoothUnion(r, triangleIsosceles(pos - vec2(0.5, 0.), vec2(0.4, 0.65)), 0.4);
	
	float w = 1e1;
	w *= -0.04;
	if(r < w) r = -(r*r + w);
	w *= -w;
	if(r < w) r = -(r*r + w);
	w *= -w;
	if(r < w) r = -(r*r + w);
	
    return r;
}

float spade(vec2 pos)
{
    float r = heart(vec2(pos.x, 1.1 - pos.y / 0.9));
    pos -= vec2(0.1, 0.);
    pos.x /= 0.9;
    pos.y *= 0.9;
    r = opSmoothUnion(r, triangleIsosceles(pos + vec2(-0.5, -0.25), vec2(0.2, -0.25)), 0.02);
    return r;
}

float diamond(vec2 pos)
{
    return rhombus(pos - vec2(0.5, 0.5), vec2(0.4, 0.5));
}

float club(vec2 pos)
{
    float r = 1e10;
    r = opSmoothUnion(r, distance(pos, vec2(0.5, 0.75)) - 0.22, 0.1);
    r = opSmoothUnion(r, distance(pos, vec2(0.21, 0.38)) - 0.22, 0.05);
    r = opSmoothUnion(r, distance(pos, vec2(0.79, 0.38)) - 0.22, 0.05);
    r = opSmoothUnion(r, distance(pos, vec2(0.5, 0.5)) - 0.15, 0.05);
    r = opSmoothUnion(r, triangleIsosceles(pos + vec2(-0.5, -0.4), vec2(0.15, -0.4)), 0.05);
    return r;
}

vec2 nHeart(vec2 pos)
{
    float base = heart(pos);
    float d = 0.001;
    return normalize(vec2(
        heart(pos + vec2(d, 0)) - base,
        heart(pos + vec2(0, d)) - base
    ));
}

vec2 nSpade(vec2 pos)
{
    float base = spade(pos);
    float d = 0.001;
    return normalize(vec2(
        spade(pos + vec2(d, 0)) - base,
        spade(pos + vec2(0, d)) - base
    ));
}

vec2 nDiamond(vec2 pos)
{
    float base = diamond(pos);
    float d = 0.001;
    return normalize(vec2(
        diamond(pos + vec2(d, 0)) - base,
        diamond(pos + vec2(0, d)) - base
    ));
}

vec2 nClub(vec2 pos)
{
    float base = club(pos);
    float d = 0.001;
    return normalize(vec2(
        club(pos + vec2(d, 0)) - base,
        club(pos + vec2(0, d)) - base
    ));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord / iResolution.xy;
    vec2 pos = 2. * (uv - vec2(0.5));
    pos.x /= iResolution.y / iResolution.x;
    pos.x += 0.1;
    pos /= 0.9;
    pos = pos / 2. + vec2(0.5);
    
    float v = heart(pos);
    vec2 norm = nHeart(pos);
    bool col = false;
    
    for(int i = 0; i < DEPTH; i++)
    {
        if(v < 0.)
        {
            if(col)
                fragColor = vec4(0, 0, 0, 1);
            else
                fragColor = vec4(1, 0, 0, 1);
            return;
        }
        if(v > 2. * A)
            break;
        float y = v / A;
        float ang = atan(norm.y, norm.x) + iTime * 0.1;
        float bigx = XREP * ang / (2. * PI);
        float x = fract(bigx);
        x = x / 0.5 - 0.25;
        int xPart = int(bigx);
        if(int_mod(xPart,2) == 0)
            col = !col;
        int asd = int_mod((xPart / 2),2);
        pos = vec2(x, y);
        pos = vec2(0.5, 0.5) + (pos - vec2(0.5, 0.5));
        if(col)
        {
            if(asd == 0)
            {
            v = spade(pos);
            norm = nSpade(pos);
            }
            else
            {
                v = club(pos);
                norm = nClub(pos);
            }
        }
        else
        {
            if(asd == 0)
            {
                v = heart(pos);
                norm = nHeart(pos);
            }
            else
            {
                v = diamond(pos);
                norm = nDiamond(pos);
            }
        }
    }
    
    fragColor = vec4(1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}