#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

vec4 texture2D_bicubic(sampler2D tex, vec2 uv)
{
	vec2 ps = 1./resolution;
	vec2 uva = uv+ps*.5;
	vec2 f = fract(uva*resolution);
	vec2 texel = uv-f*ps;
#define bcfilt(a) (a<2.?a<1.?((3.*a-6.)*a*a+4.)/6.:(((6.-a)*a-12.)*a+8.)/6.:0.) 
	vec4 fxs = vec4(bcfilt(abs(1.+f.x)), bcfilt(abs(f.x)),
			bcfilt(abs(1.-f.x)), bcfilt(abs(2.-f.x)));
	vec4 fys = vec4(bcfilt(abs(1.+f.y)), bcfilt(abs(f.y)),
			bcfilt(abs(1.-f.y)), bcfilt(abs(2.-f.y)));
#undef bcfilt
	vec4 result = vec4(0);
	for (int r = -1; r <= 2; ++r)
	{
		vec4 tmp = vec4(0);
		for (int t = -1; t <= 2; ++t)
			tmp += texture2D(tex, texel+vec2(t,r)*ps) * fxs[t+1];
		result += tmp * fys[r+1];
	}
	return result;
}

void main(void)
{
	vec2 uv = (gl_FragCoord.xy/resolution-0.5)*vec2(resolution.x/resolution.y,1.0);
	float t = mouse.x*6.2831853;
	float c = smoothstep(0.11,0.1,length(uv));
	float active = c * smoothstep(0.02,0.01,dot(uv,vec2(sin(t),cos(t))*5.));
	gl_FragColor = smoothstep(0.,1.,vec4(active) + texture2D_bicubic(bb,(gl_FragCoord.xy/resolution - 0.5)*0.99+0.5)*(1.0-c));
}
