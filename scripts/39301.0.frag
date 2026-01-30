precision mediump float;

uniform vec2 resolution;
uniform float time;
#define PI 3.14159265359

void main()
{
	
	vec3 color = vec3(1.0,1.0,0);
	vec2 uv = gl_FragCoord.xy / resolution - vec2(.5,.5);
	uv.x *= resolution.x / resolution.y;
	
	vec2 center = vec2(0.0, 0.0);
	vec2 pos = uv - center;
	float len = length(pos);
	
	
	
	if(len < 0.30 && sin(len*200.0) > 0.0){
		//if(sin(len*10.0) > 0.0)
	           //color.r = sin(time);
	   gl_FragColor = vec4(color*sin(len*200.0), 1.0);
	}
	
	float a = 0.3+0.2*sin(time);
	float b = 0.2 + 0.2*sin(time);
	
	if(len < a && len >b){
		
		vec3 color1 = vec3(1.0,1.0,0.0);
		float a = (-400.0*((len-a)*(len-b)));
		
		color1 = a * color1;
		//gl_FragColor = vec4(color1, 1.0);
	}
	
	

}