#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

vec3 nrand3(vec2 co) {
	vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );
	vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );
	vec3 c = mix(a, b, 0.5);
	return c;
}

void mainImage(out vec4 fragColor, in vec4 fragCoord) {

	vec2 uv =  (fragCoord.xy -.5 * resolution.xy) / resolution.y;
	float speed = time / 2.;
	
	float t = 0.0 + mod(speed, 3.14);

	vec2 toSun = vec2(.0) - uv;
	vec2 toMoon = vec2(-cos(t) / 1.5, sin(t) / 3.0 - 0.4) - uv;
	float sunGradiant = smoothstep(1., 0., length(toSun) * 5.);

	float moon = step(1., length(toMoon) * 7.);
	
	vec3 color = .05 + moon * vec3(
		sunGradiant * 4.,
		sunGradiant * 1.8,
		sunGradiant * 1.
	);
	
	
	vec2 uu = uv;
	float ss = speed / 10.0;
	float z = sin(speed / 40.0);
	
	uv.x = uu.x * cos(ss) - uu.y * sin(ss);
	uv.y = uu.x * sin(ss) + uu.y * cos(ss);
	
	// thanks to http://glslsandbox.com/e#54240.0
	vec3 stars = nrand3(floor(floor(uv * 1000.0) / 5.0)  * 1.337);
	vec3 starsColor = vec3(pow(stars.z, 40.));
	
	fragColor = vec4(color, 1.) + (moon*vec4(starsColor, pow(stars.y, 40.)));
}

void main( void ) {
	mainImage(gl_FragColor, gl_FragCoord);
}	