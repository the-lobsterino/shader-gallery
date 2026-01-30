// Rolf Fleckenstein

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate2D(float a)
{
	float s = sin(a);
	float c = cos(a);
	return mat2(c, -s, s, c);
}

void main(void)
{
	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy)/resolution.y;
	uv *= rotate2D(0.5*time);	
	float mode1 = floor(mod(floor(time * 0.2), 3.0));
	float mode2 = floor(mod(floor(time * 0.4), 2.0)); 
	
	vec2 uv2[3]; float t = time * +0.8;
	uv2[0] = vec2(atan(uv.y, uv.x), t + 1.0 / length(uv));
	uv2[1].y = 1.0/abs(uv.y); uv2[1].x = uv.x * uv2[1].y; uv2[1].y += sin(0.2*t) * 25.;
	uv2[1] *= rotate2D(15.0*cos(0.025*t+25.));
	uv2[2] = uv / dot(uv, uv) + t;

	float blackvoid = pow(length(uv), 1.20);
	vec2 uvout;
	if      (mode1 == 0.0) { uvout = uv2[0]; }
	else if (mode1 == 1.0) { uvout = uv2[1]; blackvoid = pow(abs(uv.y), 1.25); }
	else if (mode1 == 2.0) { uvout = uv2[2]; }
		
	vec3 color = sin(9.0 * uvout.xyx);
	color.r = clamp(0.0, 1.0, color.r);
	color.g = clamp(0.0, 1.0, color.g);
	color.b = clamp(0.0, 1.0, color.b);
	if (mode2 == 0.0)
	{
	     color = step(sin(9.0 * uvout.x) * 0.5 + 0.5, 0.5) * vec3(1.0);
	     color += step(sin(9.0 * uvout.y) * 0.5 + 0.5, 0.5) * vec3(1.0);
	     if (color == vec3(2.0)) color = vec3(0.0);
	}	
	color = mix(color, vec3(0.0, 0.0, 0.0), 1.0 - blackvoid);
	gl_FragColor = vec4(color, 1.0);
}