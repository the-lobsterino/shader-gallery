
// RegularPolygon.glsl afl_ext
#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define maxpart 8
#define pi 3.1415
vec3 regularPolygon(int parts, float radius, float blur, vec3 color, vec2 pos, float rotate, vec2 p)
{
float a = 2.0 * pi * (1.0 / float(parts));
float size = radius * cos(a /2.0);
float ca = cos(a);
float sa = sin(a);
mat2 rmat = mat2(ca, -sa, sa, ca);
ca = pi + rotate -a;
vec2 lp = vec2(sin(ca), cos(ca));
vec2 addv = lp;
float r = 0.0;
for(int i=0; i<maxpart; i++)
{
addv = rmat * addv;
lp += addv;
r = max(r, smoothstep(size, size+blur, dot(p - pos, normalize(addv))));
if (i==parts) break;
}
return (1.0 - r) * color;
}
void main( void )
{
vec2 p = (gl_FragCoord.xy -0.5555* resolution.xy)/min(resolution.y ,resolution.x);
float rot = time*0.8;
vec3 col = regularPolygon(5, 0.15, 0.01, vec3(1.0, 1.0, 0.0), vec2(-0.50, 0.25), rot, p);
col += regularPolygon(5, 0.15, 0.01, vec3(0.0, 1.0, 1.0), vec2( 0.00, 0.25*sin(time*0.5)), rot, p);
col += regularPolygon(5, 0.15, 0.01, vec3(1.0, 0.5, 0.0), vec2( 0.50, 0.25), rot, p);
col += regularPolygon(5, 0.15, 0.01, vec3(1.0, 0.0, 1.0), vec2(-0.50, -0.25), rot, p);
col += regularPolygon(7, 0.15, 0.01, vec3(0.5, 0.9, 0.5), vec2( 0.00+0.5*sin(time*0.5), -0.25), rot, p);
col += regularPolygon(5, 0.15, 0.01, vec3(0.5, 0.5, 0.9), vec2( 0.50, -0.25), rot, p);
gl_FragColor = vec4( col, 1.0 );

}