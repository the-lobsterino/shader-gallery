#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//two pixels
#define WIDTH 2.
#define computeWidth WIDTH / 2. - .5

//problem: how do you fix the pixelation when the elipse starts looking more like a line?

float ring(vec2 p, vec2 r) {
	float a = atan(p.y - gl_FragCoord.y, p.x - gl_FragCoord.x), s = sin(a), c = cos(a);
	float rr = (r.x * r.y) / sqrt(r.x * r.x * s * s + r.y * r.y * c * c);
	
	return 1. - clamp(abs(distance(p, gl_FragCoord.xy) - rr) - computeWidth, 0., 1.);
}
 float r=0.0;
void main( void ) {
 
	for(float ii=0.0;ii<10.;ii+=0.5){ 	
	
  r += ring(resolution / 2., vec2((ii*sin(time)+1.) * resolution.y / 4., ((ii/2.)*sin(time)+1.) * resolution.y / 5.));

	}
		
  gl_FragColor = vec4(r);
}