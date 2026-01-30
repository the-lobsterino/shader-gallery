#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 colour = vec3(1.0);
	
	vec4 vec = vec4(0, 0, 100, 200);
	
	float m = (vec.y - vec.w)/(vec.x - vec.z);
	
	float a = -m;
	float b = 1.0;
	float c = m*vec.z - vec.w;
	
	float d = abs(a*position.x + b*position.y + c)/sqrt(a*a + b*b);
	
	

	gl_FragColor = vec4(vec3(d,d,d), 1.0 );

}