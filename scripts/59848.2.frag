// massive minge
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 uv = (gl_FragCoord.xy - resolution * .5) / resolution.yy;
	uv.x += sin(4.0*uv.y+time)*0.1;
	uv.y += cos(4.0*uv.y+time)*0.1;
	float distance = sqrt(uv.x * uv.x + uv.y * uv.y);
	float fade = (sin(distance * 80.0 - time * 5.0) + 0.5) * 0.5;
	float fade2 = (sin(distance * 4.0 - time * 3.0) + 0.5) * 0.5;
	fade = smoothstep(0.0, 0.85, fade);
	fade2 = smoothstep(0.0, 0.85, fade2);
	gl_FragColor = vec4(fade*fade2 * 0.9, fade*fade2*0.8, fade*0.8, 1);
}