#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float x){
	return fract(sin(x) * 43758.23);
}

void main( void ) {

	vec2 uv = (gl_FragCoord.xy / resolution.xy);
	uv = uv * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	vec2 p = fract(uv);
	float c = length(p - vec2(0.5,0.5));
	c= hash(uv.x);
	
	gl_FragColor = vec4(c,c,c,1.0);

}