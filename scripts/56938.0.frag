#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float plot(vec2 uv, float value)
{
	float temp = smoothstep(value-0.25, value, uv.y*2.5*uv.x+.1) - smoothstep(value, value+0.02, uv.y);
	return (1. / temp) - temp ;
}

void main(void)
{
	// normalize
	vec2 uv = ( (gl_FragCoord.xy + 0.001*(gl_FragCoord.x * gl_FragCoord.y)) / resolution.xy );
	
	// functions
	//float y = 0.25;
	//float y = uv.x;
	//float y = pow(uv.x, 2.0);
	//float y = sqrt(uv.x);
	//float y = step(0.5, uv.x);
	//float y = smoothstep (0.1, 0.9, uv.x);
	//float y = smoothstep(0.25, 0.5, uv.x) - smoothstep(0.5, 0.75, uv.x);
	float y = sin(time+uv.x*PI*7.0)*0.5+0.5;
	
	// variables
	vec3 color = vec3(y);
	
	// plot
	float plot = plot(uv,y);
	//color = (1.0-plot)*color+plot*vec3(0.0, 1.0, 0.0);
	
	color = mix(vec3(1.0*y, 1.0*y, 1.0*y), vec3(0.6, 1.0, 99.0), uv.x)*2.0*plot;
	
	gl_FragColor = vec4(color, 1.0);
}