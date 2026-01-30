#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int MAX_ITER = 10000;

void main() {	
	vec2 c = vec2((gl_FragCoord.x + 0.5) / resolution.x * 3.5 - 2.5, (gl_FragCoord.y + 0.5) / resolution.y * 2.0 - 1.0);
    vec2 z = vec2(0.0, 0.0);
    int k = 0;

    for (int i = 0; i < MAX_ITER; i++) {
        vec2 ztemp = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        z = ztemp;
        if (dot(z, z) > 16.0) {
            float color = sqrt(float(i) / (float(MAX_ITER) / 20.0));
            gl_FragColor = vec4(color, color, color, 1.0);            
	    return;
        }
    }
    

    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
