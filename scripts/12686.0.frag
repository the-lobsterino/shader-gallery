#ifdef GL_ES
precision mediump float;
#endif
// mods by dist

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
				     

void main( void )
{
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	vec2 uPos = pos;
	uPos.x -= time/3.0;
	uPos.y -= 0.5+0.25*cos(time);
	
	vec3 color = vec3(0.0);
	float vertColor = 0.8;
	const float s = 1.5;
	const float k = 7.;
	for( float i = 1.0; i < k; ++i )
	{
		float t = time * (5.5);
	
		uPos.y += sin(i*0.0005* uPos.x*exp(1.1*i*s) - t/2.0) * 0.054;
		float fTemp = abs(1.0/(20.0*k/s) / uPos.y);
		vertColor += fTemp;
		color += vec3( fTemp*(0.3), (fTemp*i/k)/2.1, pow(fTemp,1.01)*0.5 );
	}
	
	vec4 color_final = vec4(color, 1.0);
	gl_FragColor = color_final;
	float ft = fract(time);
}

