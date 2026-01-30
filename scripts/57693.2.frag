#ifdef GL_ES
precision mediump float;
#endif


// T21 : More colors

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define time dot(surfacePosition.yx,surfacePosition)
//(1.0-exp(2.0-dot(surfacePosition,surfacePosition)))

void main( void ) {
	vec3 lookAt = vec3(0);
	vec3 dir = normalize(vec3(mouse.x-.5,mouse.y-.5,1.));
	vec3 left = normalize(cross(dir,vec3(0,1,0)));
	vec3 up = cross(dir,left);
	
	vec3 pos = vec3(0.,0,time*2.);
	
	vec2 screen = (gl_FragCoord.xy-resolution*.5)/resolution.x;
	
	vec3 ray = normalize(dir+left*screen.x+up*screen.y);
	
	gl_FragColor = vec4(vec3(fract(time)),1.);
}