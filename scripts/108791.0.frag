#ifdef GL_ES
precision mediump float;
#endif
// mods by dist

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void )
{

	vec2 uPos = ( gl_FragCoord.xy / resolution.xy );//normalize wrt y axis
	//suPos -= vec2((resolution.x/resolution.y)/2.0, 0.0);//shift origin to center
		
	vec3 color = vec3(0.0);
	float vertColor = 0.0;
	uPos.y = fract(time*.01);
	for( float i = 2.0; i < 4.0; ++i )
	{
		float t = time * (1.9);
	
		uPos.y += (tan( uPos.x-(exp(i+.0)) + (t*i/2.0) )) * 0.2;
		float fTemp = abs(10.0 / uPos.y / 30.0);
		vertColor -= fTemp - exp(fTemp+uPos.y);
		color += vec3( fTemp*(12.0-i)/10.0, fTemp*i/4.0, pow(fTemp,0.99)*1.2 );
	}
	
	vec4 color_final = vec4(color, 1.0);
	gl_FragColor = color_final;
}