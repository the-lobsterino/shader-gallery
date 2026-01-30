#ifdef GL_ES
precision mediump float;
#endif


varying vec2 surfacePosition;

void main( void ) {
	vec3 color;

	float c = (surfacePosition.x+0.3)/1.4;
	if (c<0.0 || c>1.0) color = vec3(0.0,1.0,0.0);
	else color = vec3(c * 1.0);
	
	gl_FragColor = vec4( vec3(color), 1.0 );
}