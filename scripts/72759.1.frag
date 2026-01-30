#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TWO_PI 6.28318530718

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main(){
    // vec2 st = gl_FragCoord.xy/resolution;
    vec2 st = (gl_FragCoord.xy) / resolution.y;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x)+fract(3.*time)*TWO_PI;
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    float circleBig = 1.- step(0.5,distance(st,vec2(0.5)));
    float circleSmall = step(0.25,distance(st,vec2(0.5)));
    float circle = circleBig * circleSmall;
    
    float innerEdgeBig = 1.- step(0.2575,distance(st,vec2(0.5)));
    float innerEdgeSmall = step(0.25,distance(st,vec2(0.5)));
    float innerEdge = innerEdgeBig * innerEdgeSmall;
    
    float outerEdgeBig = 1.- step(0.50,distance(st,vec2(0.5)));
    float outerEdgeSmall = step(0.4925,distance(st,vec2(0.5)));
    float outerEdge = outerEdgeBig * outerEdgeSmall;

    color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0)) * circle - innerEdge - outerEdge;
    color += hsb2rgb(vec3(((angle+210.)/TWO_PI)+0.5,radius,1.0)) * outerEdge;
    color += hsb2rgb(vec3(((angle+240.)/TWO_PI)+0.5,radius,1.0)) * innerEdge;

    gl_FragColor = vec4(color,1.);
}