#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float hash (float v) {
  return smoothstep(0.1, 1.8, abs(sin(v))) * 33.0;
}

void main(void) {
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -1.0 + 2.0 * q;		
    p.x *= resolution.x / resolution.y;	
	
    vec3 col1 = vec3(0.3, 0.2, 0.3);
    vec3 col2 = vec3(0.2, 0.3, 0.2);
    vec3 c = vec3(0.5);	
    c += col1 / (abs(tan(hash(p.x) + cos(time + p.y)))); 
    c += col1 / (abs(tan(hash(p.y) + cos(time + p.x))));
    c += col2 / (abs(tan(hash(p.x) + sin(time + p.y))));
    c += col2 / (abs(tan(hash(p.y) + sin(time + p.x))));
    c /= 18.0;	
	
    gl_FragColor = vec4(c, 1.0);
}