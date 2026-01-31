#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.y;
	gl_FragColor = vec4(0.0, 0.0, 0.0, 6.0);
	for(int i = 1; i <= 65; i++){
		float a = float(i)*0.1;
		vec2 v = vec2(0.5, 0.5);
		v.x += 0.2*(sin(a*time) + cos(a*time*1.2));
		v.y += 0.2*(sin(a*time*1.02) + cos(a*time*1.2));

		float size = 0.2;
		float b = 0.2 * (1.0 - mouse.y);
		float d = distance(uv, v)/size;
		float f = 1.0 - clamp(d, b, 1.0);
		f = pow(f, 20.0);
		vec3 clr = 1.2 * f * vec3(0.6, 0.6, 5.0);
		gl_FragColor.rgb += clr, 20.0;
	}
}
