#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

vec3 hsv(in float h, in float s, in float v) {
	return mix(vec3(1.0), clamp((abs(fract(h + vec3(3, 2, 1) / 3.0) * 6.0 - 3.0) - 1.0), 0.0 , 1.0), s) * v;

}

//void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
void main( void ) {


	vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
	p.x *= resolution.x / resolution.y;
	vec2 c = vec2(-time*0.00154, time*0.2485);
	float d = 1.0;
	vec3 col = vec3(0);
	float t = time;
	for (int i = 0; i < 40; i++) {
		float r = length(p);
		p /= r;
		p = asin(sin(p/r + c));
		col += hsv(r, max(1.0-dot(p,p), 0.0), 1.0);
	}
	gl_FragColor = vec4(sin(col)*0.5+0.5,
			    		1.0);
}