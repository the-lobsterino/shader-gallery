#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

#define DOF  
mat3 rotmat(vec3 v, float angle) 
{ 
float c = cos(angle*2.0); 
float s = sin(angle) + 0.01*cos(angle); 
 
return mat3(c + (1.0 - c) * v.x * v.x, (1.0 - c) * v.x * v.y - s * v.z, (1.0 - c) * v.x * v.z + s * v.y, 
(1.0 - c) * v.x * v.y + s * v.z, c + (1.0 - c) * v.y * v.y, (1.0 - c) * v.y * v.z - s * v.x, 
(1.0 - c) * v.x * v.z - s * v.y, (1.0 - c) * v.y * v.z + s * v.x, c + (1.0 - c) * v.z * v.z 
); 
} 
 
//Distance Field
vec4 de(vec3 pos) { 
vec3 A=vec3(3.); 
vec3 p = abs(A-mod(pos,2.0*A));
float sph=length(p)-.9; 
float cyl=length(p.xy)-.3012; 
cyl=min(cyl,length(p.xz))-.012; 
cyl=min(cyl,length(p.yz))-.012; 
p=p*rotmat(normalize(vec3(0,0,.7)),abs(sin(time))+radians(45.)); 
if (max(abs(pos.x),abs(pos.y))>A.x) { 
cyl=min(cyl,length(p.xy))-.3012; 
cyl=min(cyl,length(p.xz))-.012; 
cyl=min(cyl,length(p.yz))-.012; 
} 
   float d=min(cyl,sph); 
vec3 col=vec3(0.); 
	p.y = dot(p,p)*sin(time)*0.05;
if (sph<cyl && d<.1) col=vec3(.9,.85,.7); else col=vec3(.75-p.y*0.2,0.3,0.5+p.y)*0.84;
	return vec4(col,d); 
 
} 
 
 
void main(void) 
{ 
float focus=.0013; 
float viewangle=0.; 
 
//camera 
mat3 rotview=rotmat(vec3(0.,1.,0.),radians(viewangle)); 
vec2 coord = gl_FragCoord.xy / resolution.xy *2.2 - vec2(1.); 
coord.y *= resolution.y / resolution.x; 
float fov=min((time*.2+.2),0.9); //animate fov at start 
vec3 from = vec3(0.,sin(time*.5)*2.,time*5.); 
 
vec3 p; 
float totdist=-1.5; 
float intens=1.; 
float maxdist=80.; 
vec3 col=vec3(0.); 
vec3 dir; 
for (int r=0; r<160; r++) { 
if (totdist<maxdist){ 
dir=normalize(vec3(coord.xy*fov,1.))*rotview  
*rotmat(normalize(vec3(0.05,0.05,1.)),time*.3+totdist*.015); //rotate ray 
vec4 d=de(p); //get de and color 
float distfactor=totdist/maxdist; 
float fade=exp(-.06*distfactor*distfactor); //distance fade 
float dof=min(.15,1.-exp(-2.*pow(abs(distfactor-focus),2.))); //focus 
float dd=abs(d.w);  
#ifdef DOF 
totdist+=max(0.007+dof,dd); //bigger steps = out of focus 
#else 
totdist+=max(0.007,dd); 
#endif 
p=from+totdist*dir; 
intens*=fade; //lower bright with distance 
col+=d.xyz*intens; //accumulate color 
} 
} 
 
col=col/maxdist; //average colors (kind of) 
col*=pow(length(col),2.3)*.5; //contrast & brightness 
 
//light 
col+=vec3(1.1,.95,.85)*pow(max(0.,dot(dir,vec3(0.,0.,1.))),12.)*.8;  
col+=vec3(.2,.17,.12)*pow(max(0.,dot(dir,vec3(0.,0.,1.))),200.); 
 
col*=min(1.,time); //fade in 
 
gl_FragColor = vec4(col,1.0); 
}
