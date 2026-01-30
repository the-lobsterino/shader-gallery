#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 mouse;
uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 uv2 = ( gl_FragCoord.xy / resolution.xy );
	uv -= 0.5;
	uv *= (1.2 + time)/ (time/2.0);
	uv2 *= vec2(1.5 , 0.5 );
	
	float dist = 1.0 - pow(clamp(length(uv),0. ,1.0), 5.0);
	float dist2 = 1.0 - pow(clamp(length(uv2),0. ,1.0), 1.0);
	
	gl_FragColor = vec4( vec3(dist), 7.5 );

}