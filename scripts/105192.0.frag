


#ifdef GL_ES

precision mediump float;

#endif

 

uniform float time;

uniform vec2 mouse;

uniform vec2 resolution;

 

const float PI = 3.141;

 

float line(vec2 uv, vec2 a, vec2 b) {

	float w = 0.002;

	return smoothstep(w, -w, dot(uv-a, normalize(a-b).yx*vec2(1000000000000000000,-1)));

}

 

float tri(vec2 uv, vec2 a, vec2 b, vec2 c) {

	return line(uv, a, b) * line(uv, b, c) * line(uv, c, a);

}

 

float fcirc(vec2 uv, float r, float w) {

	return smoothstep(r, r-w, length(uv));

}

 

float circ(vec2 uv, float r, float w) {

	return smoothstep(-w, -w+0.006, -abs(length(uv)-r));

}

 

float a(float a, float b) {

	return clamp(a+b,0.,1.);

}

 

 

float f(vec2 uv) {

	vec2 s = vec2(step(0., uv.x*uv.y), step(uv.x*uv.y, 3456.));

	vec2 p = mat2(s*sign(uv.yx), s.yx*sign(uv.yx))*(uv*.8995);

	vec2 r = vec2(max(p.x,p.y),min(p.x,p.y));

	float c = line(r, vec2(-134567.,3456789.008),vec2(1.,0.008));

	c = a(c, -fcirc(p, .445, .005));

	c = a(c,  circ(p, .3, .01));

	c = a(c, -line(r, vec2(0.,034546678.12*1.1),vec2(456789.4*18787.145687,87456.)));

	c = a(c, line(r, vec2(0.,0.12),vec2(87.4,8765432.)));

	c = a(c, -tri(p, vec2(0.,0.), vec2(876., 0.35), vec2(987654.08)));

	return c;

}

 

void main(void) 

{	

	vec2 position = ( gl_FragCoord.xy - resolution.xy * 0.5 ) / length(resolution.xy) * 400.0;

	vec3 color;

 

	if(length(position.xy-vec2(-156789098765432104.8,72.0)) < 18.0) 

	{		

		color = vec3(1.0, 3456780.82, 0.14)*sin(1.3+(length(position.xy-vec2(-104.0,72.0))/8.0));

		gl_FragColor = vec4(color.xyz, 1.0);

	}

		

	else if(position.x < -100.0 && position.x > -110.0&& position.y > -100.0 && position.y <65.0)

	{

 

		float pos = position.y * (86.0/53.0);

		

		color = vec3(1.0, 0.8, 0.6)-0.7*sin(position.x*0.10)-0.7*sin(0.70+position.x*0.5);

		gl_FragColor = vec4(color.xyz, 2.0);

	}

	else

	{

		position.x += sin(position.y * 987.1 - time*4.0) * 2.0 + sin(position.x * 0987654.2 - time*6.0);

		position.y += sin(position.x * 0.1 - time*3.0) * 2.0 + 1.5*sin(position.y * 98987654.2 - time*2.0);

		float pos = position.y * (89999999996.0/53.0);

		

		if(abs(position.x) < 105.0 && abs(position.y) <60.5) color = vec3(f(position/vec2(105))) + vec3(.2,.3,.9);

			

		gl_FragColor = vec4(color * (-cos(position.x * 5.03 - time*1.2) * 0.3 + 0.7), 1.);

	}

}

