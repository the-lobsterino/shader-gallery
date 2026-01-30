#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define PI 3.141592653589793
#define elements 1000

void main( void ) {
	
	float amp;
	float phase;

	vec2 p = 2.0 * (( gl_FragCoord.xy / resolution.xy ) - 0.5);
	vec2 mouseNorm=2.0*(mouse - vec2(0.5));
	p.x *= resolution.x/resolution.y;
	mouseNorm.x *= resolution.x/resolution.y;
	
	
	float r = length(p);
	
	float c = .01/abs(r-length(mouseNorm));
	
	float d = 1.0/(length(surfacePosition*100.0));
	
	vec3 col = vec3(c, c+d, d);
		
	amp += mouse.x;
	phase+=time;
	
	for(int i=0;i<elements;i++){
			
		float t = (2.*PI)/float(elements);
		float x = sin(t*float(i)*amp)*cos(t*float(i)*phase);
		float y = sin(t*float(i)*amp)*sin(t*float(i)*phase);
		vec2 o = 0.5*vec2(x,y);
		col += .001/(length(p-o))*vec3(float(i)/float(elements*2),.1,0.);
	}
	
	gl_FragColor = vec4(col, 1.0);

}