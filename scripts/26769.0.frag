#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;
void main( void ) {
	float color = 0.0;
	
	float time = time - surfacePosition.x*0.3;
	
	vec2 x = vec2(0.25, fract(time/2.)*2.*3.1416);
	const float imax = 7.;
	for(int i = 1; i <= int(imax); i++){
		x.y += 2.*3.14159265/imax;
		if(length(surfacePosition - x.x*vec2(sin(x.y), cos(x.y))) < (0.1+0.005*cos(x.y*8.))*mouse.x){
			color += .5;
		}
	}
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
}