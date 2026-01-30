#ifdef GL_ES
precision mediump float;
#endif

/*
  BY ABRAKER95
*/

#define PI 3.14

uniform float time;
varying vec2 surfacePosition;
void main()
{ 
 // backround
 float bg_red = sin(surfacePosition.x*20.0-time)-cos(surfacePosition.y*20.+time);
 float bg_green = sin(surfacePosition.x*20.0)*cos(surfacePosition.y*20.+time);
 float bg_blue = sin(surfacePosition.x*20.0+time)+cos(surfacePosition.y*20.);
	
 // foreground
 float fg_red = sin(surfacePosition.x/surfacePosition.y*20.0+time*3.)/2.;
 float fg_green = cos(surfacePosition.y/surfacePosition.x*40.0+time*3.-PI/4.)/2.;
 float fg_blue = 0.;
	
 vec3 bg_color = vec3(bg_red, bg_green, bg_blue);
 vec3 fg_color = vec3(fg_red, fg_green, fg_blue);	
	
 gl_FragColor = vec4((bg_color*fg_color)+fg_color, 0.25); 
}