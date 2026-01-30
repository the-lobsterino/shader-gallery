#ifdef GL_ES
precision mediump float;
#endif
uniform float time;uniform vec2 mouse;uniform vec2 resolution;
void main(){float f=3.,g=3.;vec2 mou = (vec2(sin(time*.3)*sin(time*.17)*1.
+sin(time*.3),(1.-cos(time*.632))*sin(time*.131)*1.+cos(time*.3))+1.0)*
resolution.xy;vec2 z = ((-resolution.xy+2.*gl_FragCoord.xy)/resolution.y);
vec2 p=((-resolution.xy+2.+mou)/resolution.y);
for(int i=0;i<20;i++){float d=dot(z,z);z=(vec2(z.x,-z.y)/d)+p;z.x=abs(z.x);
f=max(f,(dot(z-p,z-p)));g=min(g,sin(mod(dot(z+p,z+p),6.24))+1.);}f=abs(-log(f)/
3.5);g=abs(-log(g)/8.);gl_FragColor=vec4(min(vec3(g,g*f,f),1.),1.);}