//#ifdef GL_ES
//precision mediump float;
//#endif

precision mediump float;
#define PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 resolution;
 
void main() {
    float v = 0.0;
    vec2 c = (gl_FragCoord.xy / resolution.xy * 20.0);
    v += sin(c.x+time);
    v += sin(c.y+time);
    v += sin(c.x+time);
    v += sin(c.y+time);
    v  += sin(c.x+time*1.5 + c.y+time*2.0);
    v += sin(c.x+time + c.y+time);
    c += vec2(sin(time/3.0), cos(time/2.0));
    v += sin(sqrt(c.x*c.x+c.y*c.y+1.0)+time);
    vec3 col = vec3(tan(PI*v), sin(PI*v), cos(PI*v));
    gl_FragColor = vec4(col, 1.0);
}