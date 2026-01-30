// Mines      by gaz
// original:  https://www.shadertoy.com/view/lt2SDd

#ifdef GL_ES
precision highp float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI  3.14159265359

mat2 rotate(float a)
{
  float sa = sin(a);
  float ca = cos(a);
  return mat2(ca, sa, -sa, ca);
}

float hash(in vec3 p)
{
  p = fract(p * vec3(.16532,.17369,.15787));
  p += dot(p.xyz, p.yzx + 19.19);
  return fract(p.x * p.y * p.z);
}

float sdSegment(in vec2 p, in vec2 a, in vec2 b)
{
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// 3D Folding (https://www.shadertoy.com/view/XlX3zB)
vec3 map(vec3 pos, float type) 
{
    float cospin = cos(PI / type);
    float scospin = sqrt(0.75 - cospin * cospin);
    vec3 nc = vec3(-0.5, -cospin, scospin);
    for(int i = 0;i < 5; i++)
    {
        pos=abs(pos);
        pos-=2.0 * min(0.0, dot(pos, nc)) * nc;
    }
    return pos;
}

float map1(in vec3 p)
{   
  
    p.yz *= rotate(time * 0.01);
    p.zx *= rotate(time * 0.02);
    vec3 q = p;
    // Sparse grid (https://www.shadertoy.com/view/XlfGDs)
    float c = 0.4;
    vec3 ip = floor(p / c);
    p = mod(p,c) - c / 2.0;
    float rnd  = hash(ip);
    float size = hash(ip + vec3(123.123)) * 0.05 + 0.1;  
    float d2D;
    float d3D = 0.3;
    if (length(floor(abs(q)/c)) < 5.0) 
    if (rnd < 0.13)
    {       
        p.xy *= rotate(time * (hash(ip + vec3(456.456)) - 0.5));
        p.yz *= rotate(time * (hash(ip + vec3(789.789)) - 0.5));
//        p = fold(p, 5.0);
        if      (rnd < 0.1)   d2D = abs(abs(p.x) + abs(p.y) - 0.05);            
        else if (rnd < 0.2)   d2D = length(normalize(p.xy) * 0.03 - p.xy);            
        else                  d2D = min(sdSegment(p.xy, vec2(0.5, 0.5), vec2(-0.5, -0.5)),
                                        sdSegment(p.xy, vec2(-0.5, 0.5), vec2(0.5, -0.5)));
        p.z += -0.01 * smoothstep(0.01, 0.0, d2D);
        d3D = min(d3D, length(p) - size);
    }  
    return 0.3 * d3D;
}
vec3 v1=vec3(1.,1.,0.0);
vec4 v2=vec4(1.,1.,0.0,-0.);
#define ang 3.1415926/4.0
float c=cos(ang),s=sin(ang);
mat2 m=mat2(c,-s,s,c);
float map(vec3 p) {
	vec4 q = vec4(p, 1);
	
	q.y -= 3.;
	for(int i = 0; i < 10; i++) {

		q.xyz = abs(q.xyz) - v1;
		q /= clamp(dot(q.xyz, q.xyz), 0.01, 1.0);
		q.xy*=m;
		q = 1.8*q- v2;
	}
	
	return min(length(q.xz)/q.w -0.002,  1.0);
}

vec3 calcNormal( in vec3 pos )   
{
    vec2 e = vec2(1.0, -1.0) * 0.0001;
    return normalize(
        e.xyy * map(pos + e.xyy) + 
        e.yyx * map(pos + e.yyx) + 
        e.yxy * map(pos + e.yxy) + 
        e.xxx * map(pos + e.xxx));
}

float intersect(in vec3 ro, in vec3 rd)
{
    const float maxd = 20.0;
    const float precis = 0.002;
    float h = 0.05;
    float t = 0.0;
    for(int i = 0; i < 256; i++)
    {
        if(h < precis || t > maxd) break;
        h = map(ro + rd * t);
        t += h;
    }
    if( t > maxd ) t = -1.0;
    return t;
}

void main( void ) 
{
    vec2 p = surfacePosition;
    vec3 col = vec3(length(p) * 0.1);
    col.z += 0.25;
    vec3 ro = vec3(0., 0., 3.5);
    vec3 rd = normalize(vec3(p, -5.));
    float t = intersect(ro, rd);
    if(t > 0.0)
    {
        vec3 pos = ro + t * rd;
        vec3 nor = calcNormal(pos);
		vec3 li = normalize(vec3(0.7, 1.0, 5.0));
    	col = vec3(1.0,.8,.0);
        col *= dot(li, nor);
        col += pow(max(dot(vec3(0.4, 0.2, 1), reflect(-li, nor)), 0.0), 64.0);
//        col = pow(col, vec3(0.6)); 
    }
    gl_FragColor = vec4(col, 1.0);
}
