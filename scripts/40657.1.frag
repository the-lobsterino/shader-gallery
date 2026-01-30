#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand( vec2 uv )
{
	return fract( sin(dot(uv, vec2(12.432, 78.234))) * 4378.34 );
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	uv *= 30.0;

	vec2 i = floor( uv );
	vec2 f = fract( uv );

	f = f * f * (2.0 - 2.0*f);
	
	float x0 = mix( rand( i ), rand( i + vec2(1,0) ), f.x);
	float x1 = mix( rand( i + vec2(0,1) ), rand( i + vec2(1,1) ), f.x);
	float sum = mix(x0, x1, f.y);
	
	vec3 finalColor = vec3( sum );

	gl_FragColor = vec4( finalColor, 1.0 );

}