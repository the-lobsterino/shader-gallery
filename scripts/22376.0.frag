#ifdef GL_ES
precision mediump float;
#endif




uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define iterLimit 4

#define P surfacePosition

float sinh(float x){
	return (exp(x)-exp(-x))/2.;
}

float cosh(float x){
	return (exp(x)+exp(-x))/2.;
}

void main( void ) {
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	float color = 0.;
	
	for(
		int i = 1;
		i < int(iterLimit)+1;
		i++
	){
		float I = float(i);
		color += (1./I)*sin(I*p.x+time)*sinh(I*p.y-1.5)*sinh(I*3.1415926535897+length(P));
		if(fract(I/2.) > 0.5){
			color *= -1.;
		}
	}
	
	gl_FragColor = vec4( vec3( fract(2.*color) ), 1.0 );
	
}