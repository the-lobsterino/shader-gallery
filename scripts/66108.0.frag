#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(  vec3 c )
{
 vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
 return c.z * mix( vec3(1.0), rgb, c.y);
}


void main()
{
    vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float angle = atan(st.y,st.x) / TWO_PI;
    float d = length(st)-0.5;
    d = 1.0-smoothstep(0.0,0.1,abs(d));    
    d = smoothstep(0.0,1.0,d*d);
    vec3 color = hsv2rgb(vec3(time+angle,1.0,1.0))*d;
    gl_FragColor = vec4(color,1.0);
}