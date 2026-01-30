//V2

//This is the smallest i could get ray marcher to be V2
//This ray marcher is 18 lines of code and 498 characters, and has more complex scene than last one.
//Note the small amount of blur in the distance as well as the fact that there is no if statement in the loop. I didnt found any way of removing it without adding more characters (new line characters dont count).
//---Aaro Perämaa
//~478 with some trimming
precision lowp float;
uniform float time;
uniform vec2 resolution;
#define rz resolution
#define v vec3
void main(){
vec2 uv=(gl_FragCoord.xy/rz.xy)-.5;
uv.x*=rz.x/rz.y;
v rd=normalize(v(uv,1));
float t=.0;
for(int i=0;i<64;i+=1){
v p=rd*t;
p.z+=time*12.;
p=v(p.x*cos(time)-p.y*sin(time),p.x*sin(time)+p.y*cos(time),p.z);
p=mod(p,11.)-5.;
vec2 q=vec2(length(p.xz)-4.,p.y);
float d=min(distance(p,v(0))-1.3,length(q)-.2);
t+=d;
}
gl_FragColor = vec4(1e1/t);
}