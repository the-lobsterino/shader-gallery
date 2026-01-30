#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

const vec3 lightDir = vec3(-0.577, 0.577, .6);

vec3 trans(vec3 p) {
	return mod(p + p.x + p.y, 2.0) - 1.;
}

float box(vec3 p){
    vec3 q = abs(trans(p));
    return length(max(q + p - vec3(0.5, 0.5, 0.5), 2.));
}

float sphere(vec3 p) {
	
    return length(trans(p*p)+cos(time)*.1) - 1.;
}

// wrote: @c0de4
float distanceFunc(vec3 p) {
	float c = cos(time*.1);
	float s = sin(time*.1);
	mat3 a = mat3(
		c, 0.0, s,
		0.0, 1.0, 0.0,
		s, 0.0, c
	);
	
	float q = min(box(p*a), sphere(p*a));

	return q;
}

vec3 getNormal(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
        distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
        distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
    ));
}

// ray marching 
// original: https://wgld.org/d/glsl/g009.html
void main(void){
    // fragment position
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    // camera
    vec3 cPos = vec3(cos(time*.1),  0.,  1.);
    vec3 cDir = vec3(-cos(time*.01)*.1,  sin(time*.01)*.1, -1.0 + cos(time*.01)*.1);
    vec3 cUp  = vec3(0.0,  1.0,  0.0);
    vec3 cSide = cross(cDir, cUp);
    float targetDepth = 1.;
    
    // ray
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    
    // marching loop
    float distance = 0.;
    float rLen = 0.;
    vec3  rPos = cPos;
    for(int i = 0; i < 16; i++){
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray - snoise(vec2(cos(time + rLen *.1)*.1)) - rLen;
    }
    
    // hit check
	        vec3 normal = getNormal(rPos);
	        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
    if(abs(distance) < 0.1){


        gl_FragColor = vec4(vec3(rLen, diff, diff), 1.0);
    }else{
	    float d = mix(0.0, rLen, 1.);
        gl_FragColor = vec4(vec3(d), 1.0);
    }
}

