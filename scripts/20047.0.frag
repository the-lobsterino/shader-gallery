#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(  ) {

	vec3 col = vec3(0.0);
	for (int i=0; i<3; i++)
	{
		vec2 p = gl_FragCoord.xy / resolution.x - vec2(0.5, 0.5 * resolution.y / resolution.x) + vec2(sin(float(i*i) + 0.5*time), sin(float(i*i*i) + 0.8*time)) * 0.25;
		float l = length(p);
		float a = atan(p.y, p.x);
	
		col.x += pow(1.0 - l, 2.0) + sin(a * 15.0 + 2.0 * time + sin(a * 7.0 + 13.0 * time) * 0.1) * 0.2 + sin(a * 3.0 +7.0 * time) * 0.4;
	
		col.y += col.x * (sin(col.x) * 0.5 + 0.5);
		if (col.x < 0.0) col.y = -col.x;
		col.z += 0.25;
		col *= 0.6;

		col.x *= 2.0*pow (col.y, sin(float(i*i) + 2.5 * time)* 0.5 + 1.5);
		col.y *= pow (col.y, sin(float(i*i*i) + 4.3 * time) * 0.5 + 1.5);
		col.z *= pow (col.z, sin(float(i*i*i*i) + 3.2 * time) * 0.5 + 1.5);
	}
	gl_FragColor = vec4(col, 1.0);

}