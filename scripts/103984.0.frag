//FERIT 09-06-2023
#

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.1415926538
void main( void ) {

	vec2 pos = gl_FragCoord.xy;
	vec2 cen=resolution.xy/2.0;
	vec2 dif=pos-cen;
	float speed=-310.0;
	//dif*=cos(time*PI/135.0);
	float color = sin(sqrt(dif.x*dif.x+dif.y*dif.y)*0.5+(time*speed));


	gl_FragColor = vec4( color,color,color, 1.0 );

}