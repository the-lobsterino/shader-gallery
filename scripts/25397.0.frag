#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
float fx=2.0;
float red_intensity=1.8;
float green_intensity=1.3;
float blue_intensity=1.8;
float dist=4.0;
void main() {
	vec2 p = surfacePosition*10.;
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
	float ripple = (sin(abs(0.8*sin(2.*r-time))));
	float bar = .8*abs(sin(a*fx+time));
	c = vec3(ripple * red_intensity - bar,
		 ripple * green_intensity - 1.5 * abs(sin(time*7.)) * bar,
		 ripple - bar * blue_intensity);
	// Sarah McLachlan - World On Fire (Junkie XL Club Mix)
	gl_FragColor = vec4(c*2.0,1.0);
}