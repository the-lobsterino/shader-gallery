#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// mini raymarcher based on https://www.shadertoy.com/view/4dtfRs

// http://glslsandbox.com/e#48609.0

// 2018-05-19, 2018-08-31 a cube variant

const vec3 sphereColor = vec3(0.3,  1.0, 0.88);
const vec3 cubeColor   = vec3(0.8, -0.8, 0.99);

float sphere_sdf(vec3 p, float radius) 
{
  return length(p) - radius;
}

float roundedCube_sdf(vec3 p, vec3 dim) 
{
  return length(max(abs(p) - dim, -0.12));
}

float torus_sdf(vec3 p) 
{
  vec2 q = vec2(length(p.xz) - 0.9, p.y);
  return length(q) - 0.1;
}

mat3 rotateX(float a) 
{
  return mat3(
    1.0, 0.0, 0.0,
    0.0, cos(a), sin(a),
    0.0, -sin(a), cos(a));
}

mat3 rotateY(float a) 
{
  return mat3(
    cos(a), 0.0, sin(a),
    0.0, 1.0, 0.0,
    -sin(a), 0.0, cos(a));
}

mat3 rotateZ(float a) 
{
  return mat3(
    cos(a), sin(a), 0.0,
    -sin(a), cos(a), 0.0,
    0.0, 0.0, 1.0);
}

float trace(vec3 o, vec3 r, mat3 tf, inout vec3 color) 
{
    float t = 0.0,d1,d2,d;
    vec3 cubeDim = vec3(0.25, 0.75, 2.0);
    for (int i = 0; i < 32; i++) 
    {
    	vec3 p = o + r * t;
        d1 = roundedCube_sdf(tf * p, cubeDim)-0.12;
        d2 = 1.8*sphere_sdf(p, 1.2);
        d = 0.9*min(d1,d2);
        t += d * 0.95;
    }
    if (d1 < d2) color = cubeColor; else color = sphereColor;
    // color = (d1*sphereColor + d2*cubeColor) / (d1+d2);    
    return t;
}

#define res resolution

void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{    
    float atime = 0.2*time;
    
    vec2 ratio = vec2(res.x / res.y, 1.0);
    vec2 uv = ratio * (2.0*fragCoord / res.xy -1.0);
    vec2 mp = ratio * (2.0*mouse -1.0);

    vec3 p = vec3(uv, 0.0) + vec3(0.0, 0.0, 1.5);
    
    vec3 l = vec3(uv, 0.0) + vec3(mp, 3.0);
    vec3 n = normalize(p);
    
    vec3 lp = normalize(l - p);
    vec3 lc = vec3(dot(lp, n));
    vec3 color = vec3(1.0, 0.0, 0.0);
    
    vec3 r = normalize(p);
    vec3 o = vec3(0.0, 0.0, -4.0);
    
    float t = trace(o, r, rotateZ(atime) * rotateY(time), color);
   
    float fog = 2.0 / (1.0 + t*t*0.2);
    
    color.b *= fog;
    vec3 fc = vec3(fog * lc * color);
    
    fragColor = vec4(fc, 1.0);
}

void main( void ) 
{
    mainImage (gl_FragColor, gl_FragCoord.xy);
}