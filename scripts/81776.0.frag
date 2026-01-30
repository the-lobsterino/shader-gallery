#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ssin(float x){
	return (1.0 + sin(2.0*x))/2.0;
}

float ccos(float x){
	return ssin(x + 3.1415926535/4.0);
}

float distSphere(float x1,float x2,float y1,float y2, float r){
	return sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)) - r;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = distSphere(position.x, 0.5, position.y, 0.5, 0.1) * distSphere(position.x, ccos(time), position.y, ssin(time), 0.1);

	gl_FragColor = vec4( -color, color, 0.0, 1.0 );

}