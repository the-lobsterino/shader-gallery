#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float vignetteRange = 150.0;
	float alpha = -1.0/(vignetteRange*gl_FragCoord.x+1.0);
	gl_FragColor = vec4(0.0, 0.1, 0.7, alpha);
	
}