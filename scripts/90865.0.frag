precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {

	vec2 uv = (gl_FragCoord.xy / resolution.xy);
	vec2 new_uv = uv;
	float val = 0.0;
	
	for (float h=0.45; h<0.90; h+=0.0325) {
		new_uv = uv - 0.5;
		
		for (float j=1.0; j<3.0; j+=0.75) {
			for (int i=0; i<8; i++) {
				new_uv.y += 0.03 * cos(float(i) * cos((new_uv.x * (1.0 + h)) * 2.953) + time * j);
				new_uv.x += 0.03 * sin(float(i) * sin((new_uv.y * (1.0 + h)) * 3.012) + time * j);
			}
		}
		
		val = max(val, distance(new_uv, vec2(0.0)));
		
	}
	
	
	gl_FragColor = vec4(vec3(val * 1.5) * vec3(val * 1.0, 0.0, val * 1.75), 1.50);

}