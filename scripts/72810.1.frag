#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {

	vec2 c = surfacePosition;
	float col = 0.0;
	float xT = 0.0;
	vec2 z = vec2(0.0);
	
	for(int i = 0; i < 1500; i++)
	{
		xT = pow(z[0], 2.0) - pow(z[1], 2.0) + c[0];
		z[1] = 2.0*z[0]*z[1] + c[1];
		z[0] = xT;
		
		if((pow(z[0], 2.0) + pow(z[1], 2.0)) > 4.0)
		{
			break;
		}
	}
	
	col = fract(dot(z,z));//(pow(z[0], 2.0) + pow(z[1], 2.0)) <= 4.0 ? 0.0 : 1.0;

	gl_FragColor = vec4( vec3( col ), 1.0 );

}