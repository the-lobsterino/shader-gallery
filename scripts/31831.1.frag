#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const mat3 convolution = mat3(
	0.05, 0.20, 0.05,
	0.20, -1.0, 0.20,
	0.05, 0.20, 0.05
);

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec4 oldSample = texture2D(backbuffer, position);
	vec2 texel = 1.0 / resolution;
	
	float a = oldSample.x;
	float b = oldSample.y;
	
	float Da = 1.0;
	float Db = 0.25;
	float f = 0.11;
	float k = 0.06;
	float dt = 1.0;
	
	float laplacianA = 0.0;
	float laplacianB = 0.0;
	
	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			vec4 sample = texture2D(
				backbuffer, 
				position + texel * vec2(float(i - 1), float(j - 1))
			) * convolution[i][j];
			laplacianA += sample.x;
			laplacianB += sample.y;
		}
	}
	
	float aPrime = a + (Da * laplacianA - a*b*b + f*(1.0 - a)) * dt;
	float bPrime = b + (Db * laplacianB + a*b*b - (k + f)* b) * dt;
	
	if (length(position - mouse) < 0.01) {
	//	bPrime += 0.02;
	}
		
	gl_FragColor = vec4(aPrime, bPrime, 0.0, 0.0);

}