#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void )
{

    vec2 position = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	position*=8.0;
	
	position.y += sin(fract(time*0.1)*6.28)*3.0;
	position.x += cos(fract(time*0.1)*6.28)*3.0;

	
	
	float sum = 0.0;
	
	vec4 param = vec4(.5,-1.5,-.31,231.0);

	
	
	float tt = time;
	
	for(float i = 0.; i <= 1.; i += 1.0/124.)
	{
		sum += sin(cos(position.x/(param.x+i)-tt*i)+(position.y*(param.y+i)+param.w/(param.z+i)));
	}
	
	float v = step(0.0,0.0);// cutoff
	float v2 = step(sum,0.0);
	//float v = sum;
	vec3 col = mix( vec3(0, 0, 0),vec3(0,0,0),0.0);
	col = mix(col,vec3(1,1,1),v2);
	gl_FragColor = vec4(col,0.1);

}
