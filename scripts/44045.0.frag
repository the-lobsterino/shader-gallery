#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Smoothing a hard image with some interpolation

float sharpImage(vec2 uv) {
	return float(length(floor(uv)) > 50.0); //hard image
}

void main( void ) {

	vec2 uv = (gl_FragCoord.xy / resolution.xy);
	uv = uv - 0.5;
	uv *= 100.0;
	uv.x *= resolution.x / resolution.y;
	
	vec2 p = fract(uv);
	     p = p * p * (3.0 - 2.0 * p);
	
	float c = sharpImage(uv);
	float c2 = sharpImage(uv + vec2(1.0, 0.0));
	float c3 = sharpImage(uv + vec2(1.0, 1.0));
	float c4 = sharpImage(uv + vec2(0.0, 1.0));
	
	c = mix(mix(c, c2, p.x), mix(c4, c3, p.x), p.y);
	
	gl_FragColor = vec4(vec3(c),1.0);

}