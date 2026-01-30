#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// modified by @hintz 2ß13-11-12

vec3 plane(vec3 ro, vec3 rd)
{
	vec3 v;
	float topD;
	
	for (int i = 0; i < 300; i++) 
	{
		v = ro+rd*(float(i)/3.0+10.0);
		
		if (abs(sin(v.x+2484.429)+sin(v.y+4920.2940)-cos(v.z-42901.49021))<0.5) 
		{
			
			topD = float(i);
			
			break;
		}
		
	}
	
	return normalize(abs(sin(v/5.0))*topD);
}

void main(void) 
{
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec3 ro = vec3(mouse.x, mouse.y*4.0, time);
	vec3 rd = normalize(vec3(2.0*uv-1.0, 1.0));
	
	gl_FragColor = vec4(plane(ro, rd), 1.0);
}