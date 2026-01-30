#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float box(vec3 p)
{
	vec3 d=abs(p)-1.00;
return    length(max(d,0.0)) + min(max(d.x,max(d.y,d.z)),0.0);
}

float calcolor(vec2 pos)
{
	float s=0.2;
	pos=mod(pos,2.0*s)-s;
	pos=abs(pos);
	float d=pos.x+pos.y-s,e=min(pos.x,pos.y),f=length(pos)-s*0.5*sqrt(2.0),g=length(pos-vec2(s,s))-s,h=length(pos-0.5*vec2(s,s))-0.5*s;
	return smoothstep(0.01,0.0,min(abs(h),min(abs(g),min(abs(f),min(abs(d)/1.414,e)))));	
}
float trace(vec3 p,vec3 dir,out vec3 target)
{
	float d,td=0.0;
	for(int i=0;i<50;i++){
		d=box(p/1.03930);
		p+=dir*d;
		td+=d;
		if(d<0.001)break;		
	}	
	target=p;
	return td;
}
float getcolor(vec3 p,vec3 dir)
{
	vec3 target;
	float d=trace(p,dir,target),color=0.0;
	vec2 pos;
	
		if(d<4.0){
				  	vec3 q=abs(target);
					if(abs(q.x-1.0)<0.04)pos=target.yz;
					else if(abs(q.y-1.0)<0.04)pos=target.xz;
					else if(abs(q.z-1.0)<0.04)pos=target.xy;
				  	color=calcolor(pos);
				}
			

	
	return color;
}
vec4 mul4(vec4 a,vec4 b)
{
	return vec4(a.xyz*b.w+a.w*b.xyz-cross(a.xyz,b.xyz),a.w*b.w-dot(a.xyz,b.xyz));
}
vec4 inv4(vec4 a)
{
	a.xyz=-a.xyz;
	return a/dot(a,a);	
}
vec3 rotate(vec3 pos,vec3 dir,float ang)
{
	dir=normalize(dir);
	vec4 q=vec4(dir*sin(ang*0.5),cos(0.5*ang));
	vec4 pos1=vec4(pos,1.0);
	q=mul4(q,mul4(pos1,inv4(q)));
	return q.xyz;	
}
void main( void ) {
	vec2 position = 2.0*( 2.0*gl_FragCoord.xy -resolution.xy)/ min(resolution.x,resolution.y );
	vec3 pos=vec3(position,2.0),dir=normalize(pos-vec3(0.0,0.0,8.0)),rotdir=normalize(vec3(mouse,1.0));
	pos=rotate(pos,rotdir,1.0*time);
	dir=rotate(dir,rotdir,1.0*time);
	 
	gl_FragColor = vec4( vec3( getcolor(pos,dir)/mouse.y,getcolor(pos,dir)*mouse.y,getcolor(pos,dir)*mouse.x), 1.0 );

}