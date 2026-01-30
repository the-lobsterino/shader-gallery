#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float rand(vec2 uv)
{
	return tan(sin(dot(uv, vec2(0.01, 10.0))) * 400.0);
}

void main( void ) {

	vec2 uv = surfacePosition;//( gl_FragCoord.xy / resolution.xy );
	float t = rand(uv + vec2(time * rand(vec2(uv.x, uv.y - time)), 100000.0));
	vec4 finalColor = vec4( t,t,t,1.0);


	gl_FragColor = finalColor;

}