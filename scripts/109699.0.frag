#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float dist = .11;
	float radius =7.1;
	
	vec3 Color = vec3(0.9, 0.0, 0.0);
	vec3 Colorb = vec3(0.0, 0.9, 0.0);
	vec3 Colorc = vec3(0.0, 0.0, 0.9);
	float col = -0.3;
	float colb = -0.3;
	float colc = -0.3;
	vec2 centr = 11.2 * (gl_FragCoord.xy * 2.0 - resolution) /
		min(resolution.x, resolution.y);
	
	for(float i = 0.0; i < 63.0; i++)
	{
	  float si = sin(time + i * dist) * 1.05;
	  float co = cos(time + i * dist) * 2.05;
		
	  col += 0.003 / abs(length(centr + vec2(si + co*cos(time*0.5) , co   )) - radius);
	  colb += 0.003 / abs(length(centr + vec2(si - co*cos(time*0.5) , co   )) - radius);
	  colc += 0.003 / abs(length(centr + vec2(si - co*sin(time*0.5) , co   )) - radius);	
	}

	
	gl_FragColor = vec4(vec3((Color * col)+(Colorb * colb)+(Colorc * colc)), 1.0);
}