#ifdef GL_ES
precision mediump float;
#endif

//made by KosmynC64

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float angle(vec2 p){
	if(p.x<0.0)return atan(p.y/p.x)*180.0/3.1415926536+180.0;
	if(p.y>0.0)return atan(p.y/p.x)*180.0/3.1415926536;
	return atan(p.y/p.x)*180.0/3.1415926536+360.0;
}

void main( void ) {

	vec2 p=vec2((gl_FragCoord.x/(resolution.x/2.0)-1.0)*(resolution.x/resolution.y),
		     gl_FragCoord.y/(resolution.y/2.0)-1.0);
	float d=sqrt(p.x*p.x+p.y*p.y);
	float f=1.0;
	float a=mod(angle(p)*(1.0/f)+time*400.0,7.);
	
	float c=cos(d*50.0+a*0.0524*f)*10.0;
	if(d<1.0)c=cos(d*50.0-a*0.0524*f)*10.0;
	if(d<0.5)c=cos(d*50.0+a*0.0524*f)*10.0;
	
	

	gl_FragColor = vec4( c,c,c, 1.0 );

}