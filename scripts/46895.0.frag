// smoothstep demo

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535897932384626433832795

void main()
{
    vec2 m = vec2(0.1, 0.1);
    vec2 o = gl_FragCoord.xy-resolution.xy/2.;
	
    vec2 edge = vec2(.4, cos(time+o.x*0.001)*0.25)*resolution;
    float smooth = smoothstep(-edge.x,edge.x,o.x);
          smooth *= 2.*edge.y;

    vec4 c = vec4(1,1,1,1);
         c *= step(smooth-edge.y, o.y);

    gl_FragColor = c;
}