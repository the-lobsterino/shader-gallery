#ifdef GL_ES 
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main() {
	vec2 p = gl_FragCoord.xy / resolution.x * 0.7;
	vec3 col;
	float tt = time * 0.05;

        for(float i = 1.0; i < 100.0; i++){
		p.x += 0.1 / (i) * sin(i * 7.0 * p.y + tt + cos((tt / (15. * i)) * i));
     		p.y += 0.1 / (i)* cos(i * 10.0 * p.x + tt + sin((tt / (15. * i)) * i));
     	}
     	col.r = abs(p.x + p.y);
    	gl_FragColor = vec4(col.r, col.r, col.r, 1.0);
}