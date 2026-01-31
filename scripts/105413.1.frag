#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

#define t time

#define number   80.00
#define size     0.50
#define border   1.50
#define speed    4.00

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define time (time - 10.)
float tw()
{
	return sin(time) * 0.5 + 0.5;
}

vec2 N22(vec2 p)
{
	vec3 a = fract(p.xyx*vec3(123.34, 234.34, 345.65));
	a += dot(a, a+34.45);
	return fract(vec2(a.x*a.y, a.y*a.z));
}

void main(void) {

        vec2 uv = (gl_FragCoord.xy/resolution.y);
	uv.x -= resolution.x/resolution.y * 0.5;
	uv.y -= 0.5;
	
	

	vec3 color = vec3(0.0);
	float m = 0.0;
	float minDist = 1.0;
	
	for (float i = 1.0; i < number + 1.0; i++)
	{
		vec2 n = N22(vec2(i)+10.);
		//vec2 n = vec2(0.125*i+0.2, 0.125*i);
		vec2 p = sin(n * t * speed);
		
		float d = length((uv-p)/size + p);
		//m += smoothstep(0.015, 0.01, d);
		
		d = d - 0.067*sin(minDist);
		minDist = sin(min(d, minDist));
		minDist = minDist / cos(minDist);
	}
	
	color = vec3(0.0, 0.235 - minDist, 0.4 - minDist) * 1.8;
	float tww = 1.1;
	//color += step(minDist, tww/3.) * step(tww/3.-(0.02 * border), minDist) * vec3(0.0, 1.0, 0.4);
	
	gl_FragColor = vec4(color, 1.0);

}