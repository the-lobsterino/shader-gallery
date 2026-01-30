#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smoothabs(float t)
{
	return t < 0.0 ? t * -1.0 : t;	
}

void main( void ) {

	vec2 pixelPos = ( gl_FragCoord.xy / resolution.xy );
	
	float toMiddle = (1.0-distance(pixelPos, vec2(0.5, 0.5)));

	vec3 color = vec3(0.3, 0.2, 0.4)*2.0;
	
	
	
	float moddedLength = mod(13.0, toMiddle) + 0.3;
	float gradient = smoothstep(0.0, 1.0, moddedLength);
	
	
	color *= vec3(gradient, gradient, gradient);
	
	
	
	

	gl_FragColor = vec4( vec3( color ), 1.0 );

}