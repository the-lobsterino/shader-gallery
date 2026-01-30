#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buffer;

float MNweights(float x)
{
	float a = abs(x);
	return step(a,2.)*((step(a,1.0000001)*((3.*a-6.)*a*a+4.)/6.)
			   +(step(1.0000001,a)*(((6.-a)*a-12.)*a+8.)/6.));
}

vec4 texture2D_bicubic(sampler2D tex, vec2 uv)
{
	vec2 ps = 1./resolution;
	vec2 uva = uv-ps*.5;
	vec2 f = fract(uva*resolution);
	vec2 texel = uv-f*ps;
	vec4 result = vec4(0);
	for (float r = -1.; r < 3.; ++r)
	{
		vec4 tmp = vec4(0);
		for (float t = -1.; t < 3.; ++t)
			tmp += texture2D(tex, texel+vec2(t,r)*ps)
				* MNweights(abs(t)-sign(t+.5)*f.x);
		result += tmp   * MNweights(abs(r)-sign(r+.5)*f.y);
	}
	return result;
}

float tim=time*0.01;
//mat2 rmx=mat2(cos(tim),sin(tim),-sin(tim),cos(tim));
mat2 rmx=mat2(cos(tim),sin(tim),-sin(tim),cos(tim))*(1.0+sin(time*0.3)*0.01);

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution;
	vec2 uv_=(uv-0.5)*rmx+0.5;
	vec4 old = texture2D_bicubic(buffer, uv_);
	vec3 col = old.gbr * 0.99 + vec3(0.1, 0.2, 1.0) * pow((.01/distance(uv,mouse)), 2.5);
	gl_FragColor = vec4( col, 1.0 );
}