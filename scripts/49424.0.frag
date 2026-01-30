
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 uv = (gl_FragCoord.xy - resolution) / resolution;
	uv *= 20.;
	vec2 st = uv;
	uv *= 20. + (.35 + cos(uv.x) * 0.15) * cos(uv.y * .01);
	uv.x = 5. * fract(uv.x) - 2.4 + 1.0 / 2.;
	float t = abs(uv.x - 0.2 * sin(uv.y + time *12.0 ));
	t = smoothstep(1.5, 1.5, t / 2.0);
    t = t * 0.66;
    t = t + 0.15;
	gl_FragColor = vec4( vec3(.65 * t) , 1.0 );
}