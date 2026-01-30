#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;


vec4 texture_at(sampler2D t, float x, float y) {
    vec2 uv = vec2(x, y) / resolution.xy;
    
    vec2 coord = (2.0 * floor(uv) + 0.5);
    return texture2D(t, coord);
}

void main(void) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	vec2 p2 = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec2 pixel = 1.0 / resolution;
	vec4 old = texture2D(backbuffer, p);
	vec4 color = texture_at(backbuffer, p.x, p.y); 
	
	vec3 col = vec3(p2.x, p2.y, 1.0);
	
	p2.x += sin(time / 1.0) / 2.0;
	p2.y += cos(time / 1.0) / 2.0;
	
	vec3 t = vec3(0.0005 / length(p2)) * col;
	
	color = vec4(vec3(t), 1.0);

	gl_FragColor = vec4(color + old * 0.98);
	
	if (time < 1.0) {
		gl_FragColor = vec4(color);
	}
}