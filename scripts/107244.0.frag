#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 Xenia(vec2 pos) {
	float size = 0.25 * (1.0 + 0.1 * sin(2.0 * time));
	float mask = step(abs(pos.x) + abs(pos.y), size) * step(pos.y, 0.5*size);
	float mask2 = step(abs(pos.x), size) * step(-pos.y, 0.0);
	mask2 *= step(2.0 * size, 1.25*abs(pos.x)+abs(pos.y-2.0*size));

	mask = clamp(mask + mask2, 0.0, 1.0);
	vec3 c0 = vec3(2.0, 1.0, 1.0);
	vec3 c1 = vec3(.961, .663, .722);
	vec3 c2 = vec3(.357, .808, .98);
	int c = int(abs(2.5*pos.x/size)+0.5);
	vec3 col = c0;
	if (c == 1) col = c1;
	if (c == 2) col = c2;
	col *= mask;
	col += exp(-2.0*length(pos)/size)*(1.0-mask)*0.5*(c1+c2);
	
	return col;
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position -= 0.5;
	position.y *= resolution.y / resolution.x;
	position += 0.3 * (0.5 - mouse);

	gl_FragColor = vec4(Xenia(position * 1.5), 1.0);
}