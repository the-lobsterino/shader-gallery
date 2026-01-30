#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rect(vec2 uv, vec2 pos, vec2 size,float sharpness) {
return  clamp(1. - length(max(abs(uv - pos)-size, 0.0))*sharpness, 0.0, 1.0);
}
float hash(float v)
{
    return fract(fract(v/1e4)*v-1e6);
}
void main( void ) 
{
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float color = 0.0;
	
	float i_f = 1.;
	for(int i = 0;i < 50;i++)
	{
		i_f += 1.;
		float sharpness =  2000.;
		float r = hash(i_f) * 50.;
		color += (rect(position, vec2( mod(time * 0.001 * (i_f * r * .2), 3.) - 1. , mod(r,1.)   ), vec2(0.3,0.13) * (i_f * 0.025) , sharpness) * (0.02 * (i_f * 0.15) ));		
		color += (rect(position, vec2( mod(time * 0.001 * (i_f * r * .2), 3.) - 1. , mod(r,1.)   ), vec2(0.3,0.13) * (i_f * 0.025) , sharpness * 0.02) * (0.02 * (i_f * 0.15) ));		
		
	}
	
	gl_FragColor = vec4(color,color,color, 1.0 );
}