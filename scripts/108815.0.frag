#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
float fx=2.0;
float red_intensity=57.8;
float green_intensity=0.;
float blue_intensity=1.8;
float dist=46.0;
void main() {
	vec2 p = surfacePosition*45.;
	vec3 c = vec3(0.,0.,0.);// vec3 R, G, B
	float a = atan(p.x,p.y);
	float r = length(p*dist);
	//fx/=1.*cos(time/4.0);// remove if you want
	// so shift color to blue component !
	//-------- RED ,GREEN,------ B   L  U   E  -------------------------------
	//c = vec3(0.0 ,0.0  ,(sin(abs(0.8*sin(2.*r-time)))) - .8*abs(sin(a*fx+time)));
	
	// shift to red 
	//---------         R        E         D                      ,GREEN,BLUE 
	//vec3((sin(abs(0.8*sin(2.*r-time)))) - .8*abs(sin(a*fx+time)),0.0  ,0.0);
	
	// or mix red+green to obtain yellow and set blue to 0 !!                                                                                            
	c = vec3((sin(abs(0.8*sin(2.*r-time))))*red_intensity - .8*abs(sin(a*fx+time)),green_intensity,(sin(abs(0.8*sin(2.*r-time)))) - .8*abs(sin(a*fx+time))*blue_intensity);
	
	gl_FragColor = vec4(c*2.0,1.0);
}