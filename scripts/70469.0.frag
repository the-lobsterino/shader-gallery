precision mediump float;
#define PI 3.1415926535897932384626433832795
 
uniform float u_time;
uniform vec2 u_k;
varying vec2 v_coords;
 
void main() {
    float v = 0.0;
    vec2 c = v_coords * u_k - u_k/2.0;
    v += sin((c.x+u_time));
    v += sin((c.y+u_time)/2.0);
    v += sin((c.x+c.y+u_time)/2.0);
    c += u_k/2.0 * vec2(sin(u_time/3.0), cos(u_time/2.0));
    v += sin(sqrt(c.x*c.x+c.y*c.y+1.0)+u_time);
    v = v/2.0;
    vec3 col = vec3(1, sin(PI*v), cos(PI*v));
    gl_FragColor = vec4(col*.5 + .5, 1);
}