//xL
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float LW = .98;
float pi = 3.14159265;
float ti = time * .025;
float spread = 1.;


void main(void)
{
	vec2 pos = gl_FragCoord.xy;
	pos /= resolution;

	vec3 wave;
	vec3 dist;
	vec3 col = vec3(0.,0.,0.);
	
	for(int i = 1; i < 15; i++){
	wave.r = 0.5 + 0.4 * sin(2.0 * pi * pos.x+ ti +spread*sin(float(i)*ti));
	dist.r = 1.0 - clamp(4.0 * abs(wave.r - pos.y), 0.0, 1.0);
	dist.r = smoothstep(LW, 1.0, dist.r);
	wave.g = 0.5 + 0.4 * sin(2.0 * pi * pos.x + pi * 1.3333 + ti+spread*sin(float(i)*ti));
	dist.g = 1.0 - clamp(4.0 * abs(wave.g - pos.y), 0.0, 1.0);
	dist.g = smoothstep(LW, 1.0, dist.g);
	wave.b = 0.5 + 0.4 * sin(2.0 * pi * pos.x + pi * 0.6666+ ti+spread*sin(float(i)*ti));
	dist.b = 1.0 - clamp(4.0 * abs(wave.b - pos.y), 0.0, 1.0);
	dist.b = smoothstep(LW, 1.0, dist.b);
	col += dist;
		
}
	
	gl_FragColor = vec4(col,1.0);

}