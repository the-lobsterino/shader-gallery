#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX 100.0

void main( void ) {
	float iter=2.0+100.0*pow(abs(sin(time)),3.0);
	vec2 p = ( gl_FragCoord.xy / resolution.xy )-0.5;
	p*=vec2(20.0,5.0);
	p.x+=0.1*time;
	float f=0.0;
	for(float i=1.0;i<MAX;i++){
		if(i<iter)
		f+=sin(i*p.x)/i;
		//f+=sin((2.0*i-1.0)*p.x)/(2.0*i-1.0);
	}
	gl_FragColor=vec4(smoothstep(0.02,0.03,abs(p.y-f)));
}