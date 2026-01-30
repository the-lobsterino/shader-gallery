#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//---Playing around with some trippy derivatives... Nice! Fun...

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float bHelper(vec3 p)
{
  return max(max(p.x,p.y),p.z);	
}

float geometry(vec3 center, vec4 params, int geo)
{
	if(geo==0)
		return length(center - params.xyz) - params.w;
	else
		return bHelper(abs(center - params.xyz)) - params.w;
}

float map(vec3 center)
{
	float final = 0.0;
	
	float _s = geometry(center, vec4(0,0,0.5,0.2), 0);
	float _b = sin(geometry(center, vec4(0.0,0,0.5,0.05), 1)*pow(time,0.094))*0.145;
	return min(_s,_b);	
}


float march(vec3 ro, vec3 rd)
{
	float progress = 0.0;
	
	for(int i = 0; i < 40; i++)
	{
		vec3 pos = ro + rd * progress;
		progress += map(pos);
		if(progress > 120.0)
			break;
	}
	
	return progress;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	uv.x*= resolution.x/resolution.y;
	//uv = mix(uv, uv+(-(mouse - 0.5)), sin(time*5.)*1.2);

	
	vec3 ro = vec3(uv, 0);
	vec3 rd = vec3(0,0,1);
	
	float color = pow(fract(march(ro,rd) * time * 0.2),8.);

	gl_FragColor = vec4(color);

}