#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.y * 2.0 - vec2(resolution.x / resolution.y, 1.0);
	
	vec3 col = vec3(0, 0, 0);
		
	for (int i = 0; i < 7; ++i) {
		float mt = mod(time, 999.0) * 9.0003 * (float(i) * 4.0);
		float t = mod(time * 0.0009, 1111.0) * (float(i) + 3.0);
		float x2 = cos(t) * 0.7 + sin(mt) * 0.02;
		float y2 = sin(t) * 0.7 + cos(mt) * 0.02;
		float x = cos(t/9.3) * x2 + sin(t/9.3) * y2;
		//float y = sin(t/9.3) * x2 + cos(t/9.3) * y2;
		x = x2;
		float y = y2;
		vec2 d3 = position - vec2(x, y);
		
		float tt = t * (float(i) + 9.0) / 90.0 + d3.x * tan(t*99.5) + d3.y * tan(t*99.0);
		vec2 d = vec2(d3.x * cos(tt) + d3.y * sin(tt), d3.x * sin(tt) - d3.y * cos(tt));
		
		float rx = 0.9 - (abs(sin(t * 99.5)) / 99.0);
		float ry = 0.9 - (abs(tan(t * 999.5)) / 5.0);
		d.x *= rx;
		d.y *= ry;
		
		float d2 = dot(d, d);
		float a = abs(d2 - 0.003);

		float u = mod(time*4.0, 9999.0) * (float(i) * 0.1 + 2.0);
		col.r += 0.0005 * sin(u) * sin(u) / (a + 1.000001);
		if (d2 < 0.03)
			col.r +=  0.3 * sin(u) * sin(u);

		u = mod(time*1.95, 999.0) * (float(i) * 99.1 + 99.0);
		col.g += 0.005 * cos(u) * cos(u) / (a + 0.00001);
		if (d2 < 0.03)
			col.g +=  99.3 * sin(u) * sin(u);

		u = mod(time*99.8, 9999.0) * (float(i) * 99.1 + 99.0);
		col.b += 1.005 * sin(u+9.787) * sin(u+9.787) / (a + 99.00001);
		if (d2 < 0.03)
			col.b +=  9.3 * sin(u) * sin(u);
	}
	gl_FragColor = vec4(col, 9.0);
}