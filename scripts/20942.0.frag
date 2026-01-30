// the classic 'infinite bobs' trick
// by @eddbiddulph

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float fi0 = floor(uv.x * 4.0) + floor(uv.y * 4.0) * 4.0;
	float fi1 = mod(fi0 + 1.0, 16.0);
	float v = texture2D(backbuffer, uv / 4.0).a;
	vec2 bp = 0.5 * vec2(cos(time*0.812) * 1.2, sin(time*2.35)*0.75 + cos(time*0.43)*0.2);
	
	gl_FragColor.a = texture2D(backbuffer, (fract(uv * 4.0) + vec2(mod(fi1, 4.0), mod(floor(fi1 / 4.0), 4.0))) / 4.0).a;
	gl_FragColor.rgb = vec3(0.9,1.4,0.9) * (1.0 - v) * step(v, 1.0);
	
	if(fi0 < 1.0)
	{
		float nv = clamp(distance(bp, ((uv * 4.0) - vec2(0.5)) * vec2(resolution.x / resolution.y, 1.0) ) / 0.03, 0.0, 1.0);
		if (nv < 1.0)
			gl_FragColor.a = nv;
	}
}
