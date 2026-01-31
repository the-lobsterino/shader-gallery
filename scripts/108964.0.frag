#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Author:
// Title:

const float PI = 3.1415926535;
const float WIDTH = 0.85;
const float HEIGHT = 0.804;
const float CLOTHTHICKNESS = 0.164;
const float CLOTHFINENESS =30.;
const vec3 LINENCOLOR = vec3(200.,190.,180.)/256.;

// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}

float map(float froml, float fromr, float tol, float tor, float x){
    x-=froml;
    x/=fromr-froml;
    x*=tor-tol;
    x+=tol;
    return x;
}

//credit https://stackoverflow.com/questions/9446888/best-way-to-detect-nans-in-opengl-shaders
bool isnan( float val )
{
  return ( val < 0.0 || 0.0 < val || val == 0.0 ) ? false : true;
}

//draws a costube on [-1,1]^2
float sineTube(vec2 v, float _width, float _height){
    float sine = -0.5*cos(v.x*PI)+0.5;
    float _y = v.y/_width;
    float circHeight = sqrt(_width-_y*_y)*_height/_width;
    //can be NaN if _y is >than _width
    //circHeight = isnan(circHeight)? 0. : circHeight;
    float result = (sine+circHeight)/(1.+_height);
    return isnan(result)? 0.: result*CLOTHTHICKNESS;
}

//here v is in [0,1]^2
float clothPattern(vec2 v, float _width, float _height){
    float threadht = sineTube(vec2(v.x*2.-1.-0.5,map(0.,1.,-3.,1.,v.y)),_width,_height);
    float threadhb = sineTube(vec2(v.x*2.-1.+0.5,map(0.,1.,-1.,3.,v.y)),_width,_height);
    float threadvr = sineTube(vec2(v.y*2.-1.+0.5,map(0.,1.,-3.,1.,v.x)),_width,_height);
    float threadvl = sineTube(vec2(v.y*2.-1.-0.5,map(0.,1.,-1.,3.,v.x)),_width,_height);
    float un = max(max(max(threadht, threadhb),threadvl),threadvr);
    return un;
}

vec3 clothPatternNormal(vec2 v, float _width, float _height){
    float epsilon = 1./(2.*max(resolution.x,resolution.y));
    vec2 xnudge = v + vec2(epsilon, 0.);
    vec2 ynudge = v+vec2(0.,epsilon);
    
    vec3 v3 = vec3(v,clothPattern(v,_width,_height));
    vec3 xnudge3 = vec3(xnudge,clothPattern(xnudge,_width,_height));
    vec3 ynudge3 = vec3(ynudge,clothPattern(ynudge,_width,_height));
    vec3 normal = normalize(cross(xnudge3-v3,ynudge3-v3));
    return normal;
}

vec2 oct(vec2 v)
{
	vec2 a = abs(v);
	return vec2(max(a.x,a.y), min(a.x,a.y));
}
//pattern is in [-1,1]^2
vec3 star(vec2 v){
    vec2 oct = oct(v);
    float x = oct.x;
    float y = oct.y;
    
    float redmask =  step(0.5,y)*step(x,0.7) + step(0.93,v.x) + step(v.x,-0.93);
    redmask = step(1.,redmask);
    
    float blackmask = step(x+y, 0.06) + step(y,0.356)*step(0.088,y)*step(y,x-0.108)*step(x,y+0.468);
    blackmask = step(1.,blackmask);
    
    vec3 color = LINENCOLOR;
    color = redmask*vec3(1.,0.,0.)+(1.-redmask)*color;
    color = blackmask*vec3(0.1)+(1.-blackmask)*color;
    return color;
}
vec2 pixellate(vec2 v, float n){
    v= v*2.-1.;
    v*=n;
    return (floor(v)+vec2(0.5))/n;
}

vec3 colorPattern(vec2 v){
    return star(pixellate(v, 26.));
}
vec2 distort(vec2 v, float frequency, float amplitude){
    return v + snoise(v*frequency)*amplitude;
}

vec3 clothPatternPhongLighting(vec3 albedo, vec2 pos, float n){
    //normal is already normalized
    vec3 normal = clothPatternNormal(fract(pos*n), WIDTH, HEIGHT);
    //for now - a directional light
    vec3 lightDir = normalize(vec3(1.,1., 1.));
    
    vec3 ambient = albedo * vec3(0.5);
    vec3 diffuse = albedo * dot(normal, lightDir) * step(0.,dot(normal, lightDir));
    //if dot product is negative then set to zero
    //return vec3(step(dot(normal,lightDir), 0.));
    return diffuse+ambient;
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.x *= resolution.x/resolution.y;
    //st = 2.*st-vec2(1.);

    //vec3 color = vec3(clothPatternNormal(fract(st*10.), WIDTH, HEIGHT)/2.+vec3(0.5));
    vec3 color = clothPatternPhongLighting(colorPattern(distort(st, 100., 0.003)), distort(st,1000.,0.003), CLOTHFINENESS);
    //color*=star(pixellate(st,26.));

    gl_FragColor = vec4(color,1.0);
}