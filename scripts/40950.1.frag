#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// thanks: https://wgld.org/d/glsl/

// wrote: https://twitter.com/c0de4

float smoothMin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

vec2 rotate(vec2 p, float angle, vec2 axis){
    vec2 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat2 m = mat2(
        a.x * a.x * r + c,
        a.y * a.x * r * s,
        a.x * a.y * r * s,
        a.y * a.y * r + c
    );
    return  m * p;
}

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233))) 
                * 43758.5453123);
}

// The MIT License
// Copyright © 2013 Inigo Quilez
float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
    
    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( random( i + vec2(0.0,0.0) ), 
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ), 
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

void main( void ) {

  vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / min(resolution.x, resolution.y);

  float color = 0.0;
  
  p -= vec2(cos(time+p.y)*.1, sin(time + p.x + cos(time))*.2);
  
  float a = cos(time) + p.y + p.x - noise(vec2(p.x, p.x+sin(time)));
  float b = p.y - noise(vec2(time, p.x + cos(time)));
  float d = cos(length(mod(p+noise(vec2(a, b+time)), .2) - .1 ) * 400. + time);
  float c = .02 * abs(a + (p.x*p.x+sin(time)*.4) ) / length(mod(rotate(p+a, radians(-time * 4.), vec2(4., .1)) * .9, .2) - .1 ) - 1.;

  
  float dist = sqrt(dot(-a*b/c, a+b+c+noise(vec2(time)))) + d;
  
  color = dist;


  gl_FragColor = vec4( vec3( color * .8, color * sin(time), color * .5 * cos(time*.2) ), 1.0 );

}