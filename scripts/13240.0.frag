#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float BRIGHTNESS = .8;

// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
float field(in vec3 p) {
	float strength = 8.;
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 10; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-mouse.y, -.5-abs(sin(time/5.)/2.), -mouse.x);
		float w = exp(-float(i) / 5.);
		accum += w * exp(-strength * pow(abs(mag - prev), 10.2));
		tw += w;
		prev = mag;
	}
	
	return max(0., 3. * accum / tw - BRIGHTNESS);
}

void main() {
	vec2 uv = 1.0 * gl_FragCoord.xy / resolution.xy ;
	vec2 uvs = uv * resolution.xy / max(resolution.x, resolution.y);

	float r = field(vec3(uvs,0.4) * sin (time) );
	float g = field(vec3(uvs,0.4 * sin(time) ));
	float b = field(vec3(uvs,0.4) * sin (time) );
	gl_FragColor = vec4(r,g,b,1.);
	
}