#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float intens(float x, float y)
{
	return 1./clamp(abs(x*3.)*abs(y*10.),0.1,1.)/4.+1.-1./4.;
}

float getxoff(float x, float y)
{
	return sin((time+y+sin(time*0.3316+x*2.184)*sin(time*2.013-x*1.172))/2.)/5.;
}
float getyoff(float x, float y)
{
	return sin((time+x+sin(time*1.2416+y*1.634)*sin(time*2.376-y*1.0421))/2.)/5.;
}

void main( void ) {
	
	vec2 pos1 = surfacePosition.xy*10.;
	vec2 pos;
	float xoff=sin((time+pos1.x*1.23+pos1.y+sin(time*1.3316+pos1.x*2.184)*sin(time*2.013-pos1.x*1.572))/2.)/5.;
	float yoff=sin((time+pos1.y*1.63+pos1.x+sin(time*0.2416+pos1.y*1.634)*sin(time*2.376-pos1.y*1.0421))/2.)/5.;
	xoff+=sin((time+pos1.y*3.23+pos1.y+cos(time*1.3316+pos1.x*2.184)*cos(time*1.013-pos1.x*1.572))/2.)/5.;
	yoff+=sin((time+pos1.x*1.63+pos1.x+sin(time*0.256+pos1.y*1.634)*cos(time*2.776-pos1.x*1.6421))/2.)/5.;
	pos.x=pos1.x+xoff;
	pos.y=pos1.y+yoff;
	float intensity = intens(xoff,yoff);
	
	float dist = 5.-length(mod(pos,10.)-vec2(5,5));
	//vec3 color = vec3(sin(pos.x*3.),sin(pos.y*3.),0)*intensity;
	//vec3 color = (vec3(.3,.3,.85)*intensity + 
	//	      vec3(0.,0,.4)*intens(getxoff(pos1.x+745.,pos1.y+412.),getyoff(pos1.x+845.,pos1.y+yoff+946.))+ 
	//	      vec3(0.,0.,.3)*intens(getxoff(pos1.x+6133.,pos1.y+734.),getyoff(pos1.x+412.,pos1.y+yoff+513.))+ 
	//	      vec3(0.,0.,.1)*intens(getxoff(pos1.x+1523.,pos1.y+312.),getyoff(pos1.x+523.,pos1.y+yoff+623.)))/4.;
	vec3 color = vec3(dist,0,0)*intensity;

	gl_FragColor = vec4( color , 1.0 );

}