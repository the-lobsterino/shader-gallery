#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// irregular polygon (not ideal for raymarching)

#define pi 3.14159265

float s, c;
#define rotate(p, a) mat2(c=cos(a), s=-sin(a), -s, c) * p

// hash without sine
// https://www.shadertoy.com/view/4djSRW
//#define MOD3 vec3(.1031,.11369,.13787) // integers
#define MOD3 vec3(443.8975,397.2973, 491.1871) // UVs
float hash11(float p)
{
	vec3 p3  = fract(vec3(p) * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

// 2d irregular polygon
// p  = in vec2
// n  = number of sides
// ho = hash offset
float irregularPolygon(vec2 p, float n, float ho) {
    vec3 d = vec3(-1., 0., 1.);
    
    float ang, ang_, h0, h1, h2;
    vec2 p0, p1, p2;
    
    // angle map
    ang_ = atan(p.y, -p.x)/pi/2.+.5;
    ang = floor(ang_*n)/n;
    ang *= pi*2.;
    
    // hash offsets
    h0 = hash11( ho+floor( mod( ang_*n+d.x, n ) ) )*pi*2./n;
    h1 = hash11( ho+floor( mod( ang_*n+d.y, n ) ) )*pi*2./n;
    h2 = hash11( ho+floor( mod( ang_*n+d.z, n ) ) )*pi*2./n;
    
    // rotated points
    p0 = rotate(d.zy, ang+h0-2.*pi/n);
    p1 = rotate(d.zy, ang+h1);
    p2 = rotate(d.zy, ang+h2+2.*pi/n);
    
    // 3 planes, max()ed together
    return max( dot(p, p1), max( dot(p, p0), dot(p, p2) ) );
}

float flowerPetals(vec2 p, float n, float ho) {
    // initial f
    float f = irregularPolygon(p, n, ho);
    
    // alter f with a circle and give it smoothstep
    f = (1.-smoothstep(0., 1., f - .3*length(p)));
    
    // alter f with another polygon
    f += pow(irregularPolygon(p, 6., 1.+ho), 4.);
    
    return f;
}

void main( void )
{
    vec2 res = resolution.xy;
    vec2 p = (gl_FragCoord.xy-res/2.) / res.x;
    
    p *= 4.;
    
    float f = flowerPetals(p, 6., .345*floor(3.*time));
    
    gl_FragColor = vec4(vec3(f), 1.);
}






