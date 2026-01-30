#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;

float thermoCurve(float temperatureRise, float emisivity)
{
	float maxT = 0.2 + temperatureRise;
	float maxTx = 0.2+0.2*(1.0-emisivity);
	float minT = 0.2 - (temperatureRise * 0.15 * emisivity);
	float changeSpeed = emisivity;
	
	float x = mod(position.x - 0.25, 1.0);
	float y = smoothstep(0.0, maxTx, x);
	float ssc = 0.2; //emisivity * 0.2;
	y -= smoothstep(maxTx, maxTx*2.0, x) * (1.0-ssc)
		 + smoothstep(maxTx, 1.0, x) * ssc;
	
	return y * (maxT-minT)*0.5 + minT;
}

void main( void ) 
{
	position = ( gl_FragCoord.xy / resolution.xy );

	float r = thermoCurve(0.8, 0.8);
	float g = thermoCurve(0.5, 0.5);
	float b = thermoCurve(0.2, 0.25);
	
	gl_FragColor += vec4(1,0,0,1)*(r < position.y ? 0.0 : 1.0);
	gl_FragColor += vec4(0,1,0,1)*(g < position.y ? 0.0 : 1.0);
	gl_FragColor += vec4(0,0,1,1)*(b < position.y ? 0.0 : 1.0);
}