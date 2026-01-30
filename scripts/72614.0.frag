// Skid Refragmenter, thatotherguy 2015
// more hax

#ifdef GL_ES
precision mediump float; 
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

const float num = 24.0;
const float interval = 1.0;
const float zoom = 0.99;
const float fade = 0.95;

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
	vec2 position = (gl_FragCoord.xy / resolution.xy - 0.5) * vec2(resolution.x / resolution.y, 1.0);
	vec2 texel = gl_FragCoord.xy / resolution;
	float c = 1.0;
	for (float i = 1.0; i <= num; ++i)
	{
		vec2 skew = mouse;
		//uncomment next line for smooth auto-shiftiness:
		//skew = vec2(cos(time*0.03),sin(time*0.03))*0.2+0.7;
		float a = i / num;
		float t = (time+77.)*sin(i*num)*0.3;
		float r = smoothstep(a, a + (cos(t * skew.y)*0.5+0.5) * skew.x, length(position));
		float seg = r * smoothstep(0.005, 0.0001, dot(position, vec2(cos(t),sin(t))));
		c = abs(c - seg);
	}
	float prev = texture2D(buf,texel).a;
	float next = max(texture2D_bicubic(buf, (texel-0.5)*zoom+0.5).a * fade, c);
	if (resolution.xy == vec2(200.0,100.0))
		prev = next;
	float pulse = fract(time/interval);
	float trig = texture2D(buf,vec2(0.0)).a;
	vec3 col = vec3(0,0,pow(c,1.3))
			    + 0.01/(abs(prev-0.6)) * vec3(1.0,0.0001,0.0001)
			    + 0.01/(abs(prev-0.85)) * vec3(0.001,1.0,0.001);
	gl_FragColor = vec4(col, mix(prev, next, step(pulse,trig)));
	
	if (gl_FragCoord.x + gl_FragCoord.y < 2.0)
		gl_FragColor.a = pulse;	
	//composition debug view
	//gl_FragColor = vec4(next);
}