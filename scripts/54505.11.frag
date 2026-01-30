#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D owo;

float rand(vec2 p) {
	return fract(sin(p.x*12.9898)+sin(p.y*78.233)*43758.545);
}

vec2 rand2(vec2 p) {
	return vec2(rand(p),rand(p*2.));
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	
	f = f * f * (3.0 - 2.0 * f);
	
	/*vec2 a = rand2(i);
	vec2 b = rand2(i+vec2(1.,0.));
	vec2 c = rand2(i+vec2(0.,1.));
	vec2 d = rand2(i+vec2(1.,1.));*/
	
	float a = rand(i);
	float b = rand(i+vec2(1.,0.));
	float c = rand(i+vec2(0.,1.));
	float d = rand(i+vec2(1.,1.));
	return mix(
		mix(a, b, f.x),
		mix(c, d, f.x),
		f.y);
}

float fractalNoise(vec2 p) {
	float color = 0.;
	for (float i = 0.; i  < 6.; i++) {
		color += noise(p*pow(2.,i) + time * (i + 1.0)) * pow(2.,-(i));
	}
	return color / 10.;
}

float map(vec3 p) {
	return p.y - fractalNoise(p.xz/1.5);
}

vec3 normal(vec3 p) {
	vec2 e = vec2(0.001,0.);
	return normalize(vec3(
		map(p+e.xyy)-map(p-e.xyy),
		map(p+e.yxy)-map(p-e.yxy),
		map(p+e.yyx)-map(p-e.yyx)));
}

void main( void ) {

	vec2 uv = ( 2.*gl_FragCoord.xy- resolution.xy )/resolution.y;

	vec3 eye = vec3(0.,1.5,0);
	vec3 raydir = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 p = eye;
	float hit = 0.;
	bool isHit = false;
	float dist = 0.0;
	
	for (float i = 0.; i < 200.; i++) { 
		float d = map(p);
			hit = i;
		dist += d;
		isHit = true;
		if (abs(d) < 0.01) {
			break;
		}
		isHit = false;
		
		if (dist > 50.0)
			break;
		
		p += raydir *d ;
	
	}
	
	vec3 lightdir = -normalize(vec3(.0,-0.2,-.5));
	vec3 color;
	vec3 raynormal = normal(p);
	vec3 refDir = reflect(raydir, raynormal);
	
	if (hit > 0. && isHit) {
		float RoL = dot(refDir, -lightdir);
		color = vec3(exp2(-(RoL * 0.5 + 0.499) * 2.0e3));
	} else {
		float VoL = dot(raydir, -lightdir);
		color = vec3(exp2(-(VoL * 0.5 + 0.499) * 2.0e3));
	}
	
	//vec3 backcolor = texture2D(owo, gl_FragCoord.xy / resolution.xy).rgb;
	//color = mix(color, backcolor, 0.9);
	
	gl_FragColor = vec4( color, 1.0 );

}