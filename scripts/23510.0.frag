#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

void main(void)
{
	vec2 uv = (gl_FragCoord.xy/resolution-0.5)*vec2(resolution.x/resolution.y,1.0);
	float t = floor(time*3.);
	float c = smoothstep(0.21,0.2,length(uv));
	float active = c * smoothstep(0.02,0.01,dot(uv,vec2(sin(t),cos(t))*5.));
	gl_FragColor = mix(vec4(active), texture2D(bb,(gl_FragCoord.xy/resolution - 0.5)*0.99+0.5), (1.0-c));
}
