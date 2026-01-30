

precision lowp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float i=gl_FragCoord.x;
	float j=gl_FragCoord.y;
	float m=4.0;
	float c=-250.0;
	
	float xi=(j*m+i-c*m)/(m*m+1.0);
	float yi=m*xi+c;
	
	float d=distance(vec2(i,j),vec2(xi,yi));
	
	float cl=step(d,5.0);
	

	gl_FragColor = vec4(vec3(cl), 1.0 );

}