#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141;
mat2 rota(float r){
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}
void main(void) 
{	
	vec2 p = 2.*( gl_FragCoord.xy - resolution.xy * 0.5 ) / length(resolution.xy) * 400.0;
	vec3 color;
p*=rota(time);
	if(length(p.xy-vec2(-104.8,72.0)) < 12.0) 
	{		
		color = vec3(1.0, 0.82, 0.14)*sin(1.3+(length(p.xy-vec2(-104.40,72.0))/8.0));
		gl_FragColor = vec4(color.xyz, 1.0);
	}
		
	else if(p.x < -100.0 && p.x > -109.90&& p.y > -1.0 && p.y <65.0)
	{

		float pos = p.y * (86.0/53.0);
		
		color = vec3(1.0, 0.8, 0.6)-0.7*sin(p.x*0.10)-0.7*sin(0.70+p.x*0.5);
		gl_FragColor = vec4(color.xyz, 2.0);
	}
}