#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 cameraPosition = vec2(0.6, 0.5);
	
	vec2 r = cameraPosition - position;
	float constantFactor = 0.24*pow(length(r), 4.0) + 0.22*pow(length(r), 2.0) + 1.0;
	vec2 rPrime = r * constantFactor;
	
	if(length(rPrime) > 0.3)
	{
		//discard;
	}

	//gl_FragColor = vec4(vec3(0.5, 0.5, 0.5), 1.0);
	gl_FragColor = vec4(vec3((constantFactor-1.0)*4.0), 1.0);

}