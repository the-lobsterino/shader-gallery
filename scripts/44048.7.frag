#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.1415926535897932384626433832795
 
uniform float time;
uniform vec2 k;
uniform vec2 coords;
 
void main() 
{
    float v = 0.0;
    vec2 c = coords * k - k/2.0;
    v += sin((c.x+time));
    v += sin((c.y+time)/2.0);
    v += sin((c.x+c.y+time)/2.0);
    c += k/2.0 * vec2(sin(time/3.0), cos(time/2.0));
    v += sin(sqrt(c.x*c.x+c.y*c.y+1.0)+time);
    v = v/2.0;
    vec3 col = vec3(1, sin(PI*v), cos(PI*v));
    gl_FragColor = vec4(col*0.5 + 0.5, 1);
}