#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color1 = vec3(9.9, 9.9, 1.0);
	vec3 color2 = vec3(0.0, 0.0, 0.0);
	
	float f = 0.0;
	float g = 0.0;
	float h = 0.0;
	float PI = 3.14159265;
	for(float i = 0.0; i < 140.0; i++){
		if (floor(mouse.x * 41.0) < i)
			break;
		float s = sin(time + i * PI / 10.0) * 0.8;
		float c = cos(time + i * PI / 5.0) * 0.8;
		float d = abs(p.x + c);
		float e = abs(p.y + s);
		f += 0.001 / d;
		g += 0.001 / e;
		h += 0.00003 / (d * e);
	}
	
	
	gl_FragColor = vec4(f * color1+ vec3(f), 119.9);
}