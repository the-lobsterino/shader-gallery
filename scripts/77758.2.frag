
/* forked with piece love and happiness */


#ifdef GL_ES
precision lowp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



mat2 rot (float a)
{
  float s = sin(a);
  float c = cos(a);
  return mat2(c, s, -s, c);
}

float uppermask(vec2 position,float tt)
{
	float sum = 0.;
	
	float toff1 = position.x*.1+fract(tt*0.1)*6.28;
	float toff2 = position.y*.5+fract(tt*0.15)*6.28;;
	for(float i = 0.; i <= 1.; i += 0.022)
	{
		sum += sin(toff1+cos(toff2+position.x/(1.5+i))+(position.y*(.25+i)));
		position*=rot(0.53);
		//position *= 1.02;
	}
	
	float v =  smoothstep(.1,.9,sum);
	return v;

}

void main( void )
{

    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	
	uv.x = abs(-uv.x);
	
	float v1 = uppermask(uv*66.0,time);
	
	float v = v1;
	vec3 col = vec3(v);
	
	gl_FragColor = vec4(col,1.0);

}
