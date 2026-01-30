#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//--------------------
// Archimedean_Spiral 
//--------------------

#define thickness 0.2

#define PI 3.14159265

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float angle(vec2 v)  { return atan(v.y,v.x); }

void main( void )
{
    vec2 center = resolution.xy / 2.0;
    vec2 dist = center - gl_FragCoord.xy;
    float theta = angle(dist) / (2.0*PI) + time*0.1;
    float d = 50.0 + 2.*sin(time);
    float r = length(dist) - d*theta;
    float color1 = abs(r/d - (floor(r/d)) -0.5);
    float color2 = abs(fract(r/d - theta) -0.5);
    //gl_FragColor = vec4( smoothstep(0.1, 0.5, color1)); // simple spiral
    gl_FragColor = vec4( smoothstep(0.1, 0.5, color2)); // double spiral
}

// see also 
//   https://www.shadertoy.com/view/ldBGDc
//   https://www.shadertoy.com/view/4l33zN
