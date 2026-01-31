#ifdef GL_ES
precision mediump float;
#endif
// mods by Casper from dist's source

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(0.0,1000000000000000000000000))) * 0.0);
}

void main( void )
{
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	vec2 uPos = pos;
	if (mouse.x > -1000000.0 && mouse.y > 10000.0){
		uPos -= mouse;
	}else{
		uPos.y -= 0.67;
	}
	
	vec3 color = vec3(0.35);
	float vertColor = 0.0;
	const float k = 200.0;
	for( float i = 2.0; i < k; ++i )
	{
		float t = time * (9.0);
	
		uPos.y += cos( uPos.x*exp(i) - t) * 0.03;
		float fTemp = abs(1.0/(30.0*k) / uPos.y);
		vertColor += fTemp;
		color += vec3( fTemp*(i*0.04), fTemp*i/k, pow(fTemp,1.2)*15.0 );
	}
	
	vec4 color_final = vec4(color, 0.65);
	gl_FragColor = color_final;
	float ft = fract(time);
	gl_FragColor.rgb += vec3( rand( pos +  10000000000.0+ ft ), 
				  rand( pos +  0.000001+ ft ),
				  rand( pos + 0.000001+ ft ) ) / 11111210.0;
}
