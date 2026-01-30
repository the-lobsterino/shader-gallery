// TOASTBOY (C) ME
precision highp float;

uniform vec2 resolution;
uniform float time;
vec2 rot(vec2 p, float a)
{
float sa = sin(a), ca = cos(a);
return p * mat2(ca, -sa, sa, ca);
}   
float seg( in vec2 p, in vec2 a, in vec2 b )
{
vec2 ba = b-a;
vec2 pa = p-a;
float h =clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
return length(pa-h*ba);
}
void main()
{
vec2 p = (gl_FragCoord.xy - resolution.xy/2.) / resolution.y;
p*=1.7+sin(p.x+time*0.9)*0.3;
p = rot(p,0.5+sin(time+p.y*1.2+p.x*0.2)*0.5);
vec2 pp = rot(p,degrees(-45.0*0.5));
float d = length(pp-vec2(0.25,0.2))-0.04;
d = min(d,length(pp-vec2(0.0,0.3))-0.04);
pp = rot(pp,degrees(((pp.x-0.1)*-0.05))*sin(time)*0.85);
float d2 = seg(pp, vec2(-0.1,0.0), vec2(0.2,-0.1));
float angle = atan(p.y, p.x);
float radius = length(p*p) * (1. + sin(p.x*6.0+angle+p.y*9.0 + time)*.1);
float thin = 0.035 + 0.02*sin(p.y*10.0+time*1. + angle);
vec3 col = vec3(0.5+0.4*cos(angle*vec3(3.7,1.8,2.9))) * thin / abs (radius - 0.3+sin(20.0*p.x*p.y)*0.1);
d = abs(d)+0.015;
d = 1.0-smoothstep(0.02,0.025,d);
col+=d*(vec3(0.3,1.,0.3)*1.0+sin(time*4.0)*0.3);
d2 = abs(d2)+0.02;
d2 = 1.0-smoothstep(0.03,0.04,d2);
col.rgb+=d2*vec3(0.9,0.9,0.9);
gl_FragColor = vec4(col,1.0);
}
