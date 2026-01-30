#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;

	vec3 color = vec3(0.0);
	vec2 v = vec2(time);
	for (int i=0; i<8; i++) {
		v = abs(v)/(dot(v,v)+p)+p;
		//p = abs(p)/dot(p,p);
	}
	
	color = vec3(v*1.0,0);
	
	gl_FragColor = vec4( color, 2.0 );

}