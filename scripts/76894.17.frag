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

	
	
	float sum = 0.;
	
	vec4 param = vec4(.5,-1.5,-.31,231.0);//vec4(1.0,1.0,-0.31,231.0);

	
	
	float tt = time;//mod(time,100.0);
	
	for(float i = 0.; i <= 1.; i += 1.0/124.)
	{
		sum += sin(cos(position.x/(param.x+i)-tt*i)+(position.y*(param.y+i)+param.w/(param.z+i)));
	}
	
	float v = step(sum,0.0);// cutoff
	float v2 = step(sum+1.0,0.0);
	//float v = sum;
	vec3 col = mix( vec3(0.35, 0.7, 0.3),vec3(0.7,0.7,0.1),v);
	col = mix(col,vec3(0.2,0.35,0.8),v2);
	gl_FragColor = vec4(col,1.0);

}