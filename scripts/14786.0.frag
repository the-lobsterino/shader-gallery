#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float sharpness = .1;
const float amplitudeCarrier = 70.;
const float amplitudeModulating = 80.;
const float frequencyCarrier = .1;
const float frequencyModulating = .02;

void main( void ) {	
	vec4 color = vec4(0.,0.,0.,0.);	
	
	float lhs = gl_FragCoord.y-resolution.y/2.;
	float rhs = amplitudeCarrier*sin(time-frequencyCarrier*gl_FragCoord.x);
	float red= exp(-abs(rhs-lhs)*sharpness); // Carrier Wave
	
	rhs = amplitudeModulating*sin(time-frequencyModulating*gl_FragCoord.x);
	float green= exp(-abs(rhs-lhs)*sharpness); // Modulating Wave
	
	rhs = amplitudeModulating*(1.+(amplitudeCarrier/amplitudeModulating)*sin(time-frequencyModulating*gl_FragCoord.x))
		*sin(time - frequencyCarrier*gl_FragCoord.x);	
	float blue = exp(-abs(rhs-lhs)*sharpness); // Resultant Wave
	
	gl_FragColor = vec4(red,green,blue,1.);
}