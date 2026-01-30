#ifdef GL_ES
precision mediump float;
#endif

// TÄÄ ON HIANO

// + some sort of emboss

uniform float time;
uniform vec2 resolution;

float jutska(vec2 p) 
{
	float f = 0.15 + sin(time) * .14;
	
	for(float i = 0.0; i < 20.0; i++){
		
		float s = sin(time + sin(time) * .3 + i ) ;
		float c = cos(time + i );
		f += 0.005 / abs(length(6.0 * p * f - vec2(c/2.2, s/1.9)) -0.41);
	}
	return f;
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy * 2.0 -  resolution) / min(resolution.x, resolution.y);
	vec3 destColor = vec3(1.0, 0.0, 0.2 );

	float f = 
          jutska(position) * 4.0 - jutska(position + vec2(2.1 / resolution)) * 3.0;
		
	gl_FragColor = vec4(vec3(destColor * f), 1.0);
}