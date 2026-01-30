#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
varying vec2 surfacePosition;

#define PI 3.14159265358979
void main( void ) {
	vec2 pos = surfacePosition;
	float theta = mod((atan(pos.y/pos.x))/PI*180.,60.)*PI/180.;
	//if((length(surfacePosition))<0.3){
	
	//if((length(surfacePosition*3.))<cos(theta)){
	if(abs((length(surfacePosition*3.))-cos(theta))<0.12){
		gl_FragColor = vec4(1);
	}

}