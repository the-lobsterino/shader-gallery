#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718


void main()
{		
	vec2 uv = gl_FragCoord.xy / resolution;

	vec3 color = vec3(1.0);
	vec2 bl = smoothstep(0.01, 0.2, uv);
	vec2 br = smoothstep(0.01, 0.2, 1.0-uv);
	float pct = bl.x * bl.y * br.x * br.y;
	
	color = vec3(pct);
					
	gl_FragColor = vec4(color,1.0);
}