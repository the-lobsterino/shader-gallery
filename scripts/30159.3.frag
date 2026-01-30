#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.y;
	vec2 center = vec2( 1., 0.3 );
	float dist = length( center - uv );
	bool is_top = uv.y > center.y;
	
	float red = is_top && dist < 0.5 && dist > 0.3 ? 1.0 : 0.0;
	float green = is_top && dist < 0.4 && dist > 0.1 ? 1.0 : 0.0;
	float blue = is_top && dist < 0.2 ? 1.0 : 0.0;
	
	gl_FragColor = vec4( vec3( red, green, blue ), 1.0 );
}