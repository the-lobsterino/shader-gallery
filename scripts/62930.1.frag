// Necip's mod. 07.04.20


// Original shader: https://www.shadertoy.com/view/4ljXRR

#ifdef GL_ES
precision mediump float;
#endif

float hash (float v) {
  return smoothstep(0.1, .3, abs(sin(v))) * 40.0;	
}

uniform float time;
uniform vec2 resolution;

void main(void) {
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -1.0 + 2.0 * q;		
    p.x *= resolution.x / resolution.y;	
	   	
    vec3 col = vec3(0.2, 0.3, 0.4);
    vec3 c = vec3(0.0);	
    c += col / (abs(tan(hash(p.x) + cos(time + p.y)))); 
    c += col / (abs(tan(hash(p.y) + cos(time + p.x))));
    c /= (10.0 + 40.*abs(sin(time)));	
	
    gl_FragColor = vec4(c, 1.0);
}