#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


void main( void )
{
	vec2 position = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	position*=17.0;
	
	position.y += sin(fract(time*0.1)*6.28)*3.0;
	position.x += cos(fract(time*0.1)*6.28)*3.0;

	
	
	float sum = 0.;
	
	vec4 param = vec4(1.0,1.0,0.32,4.0);

	
	
	float tt = time;//mod(time,100.0);
	
	for(float i = 0.; i <= 1.; i += 0.2)
	{
		sum += sin(cos(position.x/(param.x+i)-(tt*i*1.0))+(position.y*(param.y+i)+param.w/(param.z+i)));
		sum+= sin((time*0.4+position.x+position.y)*i);
		sum+= sin(length(position*1.5))*1.2;
		sum+=(0.5+sin(0.5*position.x)*1.1);
		position*=(1.05);
		sum+=sin(time*0.3+position.x*length(position*.024));
	}
	
	float v = sum/3.0;
	v = pow(v,4.0);
	v = smoothstep(0.0,2.5,v)+0.5;
	
	//v = 1.0-step(v,0.1);
	vec3 col = vec3(v,v*0.2,1);
	
	gl_FragColor = vec4(col,1.0);

}
