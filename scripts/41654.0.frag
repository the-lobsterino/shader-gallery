#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform sampler2D backbuffer;
uniform vec2 resolution;

float PI = 3.141592;

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 pos = gl_FragCoord.xy - resolution.xy / 2.0;
	
	float color = 20.0;
	float A = 200.0;
	float B = 200.0;
	float T = 3.0;
	float Omega = PI*2.0/T;
	//------------------------------------------
	float x = A*cos(Omega*time);
	float y = B*cos(Omega*time);
	//------------------------------------------
        vec2 dotPos = vec2(x, y);
	
	float result = color / pow(length(dotPos - pos), 3.0);
	
	vec2 texPos = vec2(gl_FragCoord.xy/resolution);
	
	//float color = 0.0;
	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
        //color *= sin( time / 10.0 ) * 0.5;
	
	gl_FragColor = texture2D(backbuffer, texPos)*0.97 + vec4(vec3(result), 1.0 );

}