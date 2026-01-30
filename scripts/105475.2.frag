//by JUHAXGAMES
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define g gl_FragColor
#define r resolution
vec2 d,d2;float c,c2;
float t;
void main(void){
t=mod(time,24.0);
vec2 p =(gl_FragCoord.xy / r.xy)*4.*vec2(0.5,1.5);p.y+=-0.95+sin(p.x*t)*cos(24.+sin(t))+sin(1.5*time);
d = p.xy -vec2(0.07,0.05) - vec2(0.5,0.5);d2 = p.xy - vec2(0.5,0.5);
c+=.005/(0.4-sqrt(d.x*d.x+d.y*d.y));c2+=.7/(sqrt(d2.x*d2.x+d2.y*d2.y));
g = vec4( vec3(0.5*c), 1.0 );g+= vec4(vec3(0.5*c2), 1.0 );
}