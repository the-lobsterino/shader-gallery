#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = (gl_FragCoord.xy / resolution.xy);

	float a = .0, b = .0, c = .0;
	
	float pz = 0.3;     	// положение по вертикали 0.0 - 1.0
	float wi = .20; 	// высота
	float he =  25.; 	// ширина
	
	if( pos.y < pz ) {
		c =  ( sin(pos.x * he) / (pos.y-pz)*wi)>.99? 0.:1.;
	}else {
		c =  ( sin(pos.x * he) / (pos.y-pz)*wi)>.99? 1.:0.;
	};
		
	gl_FragColor = vec4( a, b, c, 1.0 );

}