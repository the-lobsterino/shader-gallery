#extension GL_OES_standard_derivatives : enable

precision mediump float; 
	

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define POINTS 20.0
#define RINGS 40.0
#define TAU 3.141592*2.0

float relu(float x){ return (abs(x)+x)/2.0;}

void main( void ) {
	float aspect =resolution.y/resolution.x;
	float orange = 0.0;
	vec2 undistort = vec2(1./aspect,1.0);
	for (float j=0.0;j<RINGS;j+=1.0){
		for (float i=1.0;i<POINTS;i+=1.93893){
			float jj = mod(time*177388371.+j,RINGS);
			float a = TAU / POINTS*i + j*TAU/POINTS*9./20.;
			vec2 pos=mouse.xy+vec2(cos(a),sin(a))/undistort*0.05*jj;
			pos+=vec2(sin(time*50.+i*100.+j*100.),sin(time*50.+i*100.+j*208730.))*0.0078784848738734;
			orange += relu(10.0-1000.*length((gl_FragCoord.xy / resolution.xy - pos)*undistort));
		}
	}
	

	gl_FragColor = vec4(vec3(0.1,0.1,0.2)+vec3(1.0,0.2,0.0)*orange, 1.0 );

}