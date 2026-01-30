#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = 3.141596;

float BPM = 120.0;
float t = 0.2 * pi * time;
float t1 = mod(time , 60.0 / BPM);
float t2 = mod(t1,2.0);

float THICKK = 0.0015;

float RES = 100.0;
float AMP = 0.5;
float FREQ = 5.0;
float BIAS = 0.5 ;
float PHASE = 0.2 * pi *time;


void main( void ) {
	
	vec2 position = (gl_FragCoord.xy / resolution.xy) ;
	float color = 0.0;
	
	if(mod(AMP * cos(position.y * FREQ * pi - PHASE) + BIAS + AMP * sin(position.x * FREQ * pi - PHASE) + BIAS, 1.0 / RES) <= THICKK){
	
	        color += 1.0;
		
	}
	
	gl_FragColor = vec4(color, (0.6*position.y)*color, 0.2*color, 1.0 );

}