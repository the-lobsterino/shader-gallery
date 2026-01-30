#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float t=time;
  

 void   main(){
	  vec2 d=gl_FragCoord.xy; 
	  gl_FragColor =vec4(0.0,0.0,0.0,1.0) ; // ios fix2 or intel fix ?
		 
	  vec4 o = vec4(0.0,0.0,0.0,1.0); // ios fix 
  
		  
          o=o+1.+fract(.3*t)-o;
	  d*=.03;int y;
	 for (int i=0;i<7;i++) {
		  
	  if(1.>mod (((y=int (mod(t-d.y/o,14.)))>3? 355525544e8:56869384.)/ exp2(float(y*7+int(abs(mod(d.x/o-7.*cos(t),14.)-7.)))),2.))
		  
	 gl_FragColor =vec4(o*=.5) ;o.z*=3.*sin(time);
	 }
 } 


// still semi-broken like the other one i already tried to fix:
// http://glslsandbox.com/thumbs/38805.png
// just sayin-- it's the glsl compiler or assembler that zeroes every variable (or not)
// which in turn is the driver's business
// and pretty sure i pointed out my drivers are FOSS, so... dictatorship happens elsewhere
// pragmatically, zeroing everything is a premature pessimization
// though calloc() has its uses it doesn't exist here
// apparently some driver writers expect us to write into everything once
// --the time we wrote down our results--
// and that is an extremely reasonable expectation