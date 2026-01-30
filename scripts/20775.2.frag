#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2  resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;
#define PI 3.14159265358979


void main( void ) {
    float x = gl_FragCoord.x /resolution.x;
    float y = gl_FragCoord.y /resolution.y;
    float r = 0.5*sin(PI*y*5.5+time)+0.5*sin(PI*x*2.0+time);	
    float g = 0.5*sin(y*3.0+time);	
    float b = sin(PI*((x-0.5)*(x-0.5)+(y-0.5)*(y-0.5))*200.0+7.0*time);
    vec4 lastcolor = texture2D(backbuffer, gl_FragCoord.xy / resolution);
    gl_FragColor = vec4(r,g,b,0.0);
    //gl_FragColor += lastcolor*0.8;
}
