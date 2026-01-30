#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

// kali?

// this is so fookin cool

vec2 rot(vec2 p, float a) {
	float c = cos(a);
	float s = sin(a);
	
	return mat2(c, s, -s, c)*p;
}

float field(in vec3 p) {
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 40; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-0.1, -.5, -1.5);
		
		p.xy = rot(p.xy, 0.4*time);
		float w = exp(-float(i) / 20.);
		accum += w * exp(-(20.0 - 2.0*sin(1.0*p.x*p.y + time))*pow(abs(mag - prev), 2.9));
		tw += w;  
		prev = mag*0.7;
	}
	
	return max(0., 3.8 * accum / tw - 0.2);
}

void main() {
	vec2 suv = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	
	float t = field(vec3(suv, 1.0));
	vec3 col = vec3(0.8 * t * t * t, 1.4 * t * t, t);
	col = pow(abs(col), vec3(1.0/2.2));
	
	gl_FragColor = vec4(col, 1);
}