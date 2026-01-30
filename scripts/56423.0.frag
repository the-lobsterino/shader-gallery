precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 skyColor = vec3(0.05, 0.2, 0.5);
vec3 lightDir = normalize(vec3(0.1, 0.25, 0.9));

vec3 getSkyColor(vec2 e) {
    e.y = max(e.y, 0.0);
    float r = pow(1.0 - e.y, 2.0);
    float g = 1.0 - e.y;
    float b = 0.6 + (1.0 - e.y) * 0.4;
    return vec3(r, g, b);
}

void main() {
	vec2 uv = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
	uv.x *= resolution.x / resolution.y;
	vec3 color = getSkyColor(uv);
	
	gl_FragColor = vec4(color, 1.0);
}