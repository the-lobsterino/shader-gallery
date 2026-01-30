#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define R length(surfacePosition)
#define TH atan(surfacePosition.x, surfacePosition.y)

void main( void ) {
	
	float r = R;
	float th = TH;
	
	float time = time*2. + r;
	
	r *= 5.0;
	r += sin(time+pow(abs(th), 1e1*sin(time)*sin(time)));
	
	vec2 z = vec2(r*sin(th), r*cos(th));
	
	
	float l = length(z);
	
	
	gl_FragColor = vec4( l );

}