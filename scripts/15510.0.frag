#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float r, g, b;
float col;

float PI = 3.14;

float rgb2hue(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return abs(q.z + (q.w - q.y) / (6.0 * d + e));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 center = vec2(0.5, 0.5);
	
	float ts = sin(time);
	
	col = abs(sin(position.x - 0.5) / sin(position.y - 0.5) / 2.);

	col += sin(time + distance(center, position)); 
	
	
	gl_FragColor = vec4(col * 1.0, col * 2.0, col * 1.5, 0.1);

}