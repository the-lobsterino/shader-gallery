#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415
//PROCEDURAL TEXTURE WORK SPACE
//c64
//CODE GOES HERE
float noise(vec2 p){
	return fract(263.325*sin(p.x*569.153)*cos(p.y*152.261)+
		     143.062*cos(p.x*129.287)*sin(p.y*179.167));
}
float wave(vec2 p,float freq,float amp,float phs,float spd){
	float disp=0.0;
	float marea=cos(time*0.5*spd+phs);
	disp+=cos(p.y*PI*freq+time*1.0+phs*0.3)*(1.5-abs(marea));
	disp+=marea*3.0;
	return (clamp(p.x*100.0+disp*amp,-1.0,1.0)+1.0)*0.5;
}
float mask(vec2 p){
	float value=0.0;
	value+=wave(p,1.0,20.0,2.0*PI*0.00,1.0)*0.35;
	value+=wave(p,1.0,20.0,2.0*PI*0.33,1.0)*0.35;
	value+=wave(p,1.0,20.0,2.0*PI*0.66,1.0)*0.35;
	return clamp(value,0.0,1.0);
}
vec3 code_here(vec2 position){
	vec2 center=vec2(-1.0,-1.0);
	vec2 vector=position-center;
	float angle=atan(vector.y/vector.x)/PI*2.0*2.0-1.0;
	float dist=distance(position,center)-1.0;
	vec2 new_position=vec2(dist,angle);
	
	vec2 centerp=vec2(1.0,-1.0);
	vec2 vectorp=position-centerp;
	float anglep=-atan(vectorp.y/vectorp.x)/PI*2.0*2.0-1.0;
	float distp=1.0-distance(position,centerp);
	vec2 new_positionp=vec2(distp,anglep);
	
	vec2 p=mix(mix(position,new_position,mouse.y),new_positionp,mouse.x);
	float m=mask(p);
	float n=noise(position);
	vec3 earth=(vec3(n)*0.5+0.5)*vec3(0.6,0.3,0.0);
	vec3 water=(vec3(n)*2.0+1.0)*vec3(0.1,0.15,0.8);
	//return mix(vec3(position.x,0.0,position.y),vec3(new_positionp.x,0.0,new_positionp.y),mouse.y);
	return mix(earth,water,m);
}

vec3 outside(vec2 position){
	float size=(sin(time*0.01)*0.5+1.0)*15.0+5.0;
	float squares=cos(position.x*PI*size+time)-cos(position.y*PI*size+time);
	float sq=clamp(squares*7.0,0.0,1.0);
	return vec3((sq-0.5)*0.33+0.5);
}



void main( void ) {

	vec2 position = (gl_FragCoord.xy - resolution.xy/2.0)/min(resolution.x,resolution.y)*2.0;// (jakobthomsen@gmx.de)
	vec3 color=vec3(0.0);
	     if(position.x> 1.)color=outside(position);
	else if(position.x<-1.)color=outside(position);
	else if(position.y> 1.)color=outside(position);
	else if(position.y<-1.)color=outside(position);
	else 			color=code_here(position);
	gl_FragColor = vec4( color, 1.0 );

}