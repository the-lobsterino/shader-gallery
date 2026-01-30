#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2  resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;
#define PI 3.14159265358979


void main( void ) {
    
    float x = gl_FragCoord.x /resolution.x -0.5;
    float y = gl_FragCoord.y /resolution.y -0.5;
    float angle = atan (x,y)+PI;
    float c=angle+50.0*sqrt(x*x+y*y);
	
    float r = 0.5+0.5*sin (c-2.01*time);
    float g = 0.5+0.5*cos (c-3.03*time);
    float b = 0.5+0.5*sin (c-PI+time);
//    vec4 lastcolor = texture2D(backbuffer, gl_FragCoord.xy / resolution);
    gl_FragColor = vec4(r,g,b,0.0);
    //gl_FragColor += lastcolor*0.8;
}