#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float pixelSize = floor(1.0 + 10.0*mouse.x);
	vec2 pQ = 100.0 * fract(.01 * floor( gl_FragCoord.xy/pixelSize)*pixelSize);
	
	float radius2 = dot(pQ-50.0,pQ-50.0);
	vec3 col1 = vec3(0.0,0.0,1.0);
	vec3 col0 = vec3(1.0,1.0,1.0);
	float mix = max(0.0,min(1.0,radius2-500.0));
	
	gl_FragColor = vec4( (1.0-mix)*col0 + mix*col1, 1.0 );

}