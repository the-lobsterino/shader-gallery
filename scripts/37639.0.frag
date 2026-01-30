precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = 3.141592653589797323;

void main()
{
	
	vec2 ms = vec2(8.0, 3.0)  * (mouse - vec2(0.5, 0.5));

	vec2 scr = (gl_FragCoord.xy / resolution - vec2(0.5, 0.5)) * sqrt(vec2(resolution.x/resolution.y, resolution.y/resolution.x)) * 4.0;
	
	vec3 iv = vec3(0.0, 1.0, 0.0);
	iv.xz += scr;
	iv /= length(iv);
	iv = mat3(1.0, 0.0, 0.0, 0.0, cos(ms.y), sin(ms.y), 0.0, -sin(ms.y), cos(ms.y)) * iv;
	iv = mat3(cos(ms.x), -sin(ms.x), 0.0, sin(ms.x), cos(ms.x), 0.0, 0.0, 0.0, 1.0) * iv;
	iv = mat3(cos(time/5.0), -sin(time/5.0), 0.0, sin(time/5.0), cos(time/5.0), 0.0, 0.0, 0.0, 1.0) * iv;
	
	float ix = -10.0 * (1.0 + 0.88 * cos(time / 5.0)) * sin(time/5.0), iy = -10.0 * (1.0 + 0.88 * cos(time / 5.0)) * cos(time/5.0) * 7.0/9.0, iz = -10.0 * (1.0 + 0.88 * cos(time / 5.0)) * cos(time/5.0) * sqrt(81.-49.)/9.0;
	
	vec4 color = vec4(0.5, 0.5, 0.5, 1.0);
	
	vec4 v = vec4(iv, 0.0);
	vec4 r = vec4(ix, iy, iz, 0.0);

	
	for(int i = 0; i < 200; i++)
	{
		float R = length(r.xyz);
	
		float stp = max(min(pow(dot(r.xyz, v.xyz), 1.5), 0.5), 0.05);
		if(R > 19.5)
			stp = 0.05;
		
		if(R >= 20.0)
		{
			float phi = atan(r.y, r.x);
			float theta  = atan(r.z, length(r.xy));
			color = vec4(mod(phi+0.005, 2.0*pi/16.0) < 0.01, mod(theta+0.005, pi/8.0) < 0.01, 0.1, 1.0);
			break;
		}
		
		if(length(r.xyz-vec3(10.0*cos(time), 8.0*sin(time), 6.0*sin(time))) < 1.5)
		{
			color = vec4(1.0, 1.0, 0.0, 0.0);
			break;	
		}
		if(R < 1.0 || length(r.xyz+v.xyz) < 1.0)
		{
			color = vec4(0.0, 0.0, 0.0, 1.0);
			break;
		}
		
		r += v * stp;
		
		float pos = - 0.5 / (R * R * R) * v.w * v.w - 1.5 / (R * R * R) * dot(v.xyz, v.xyz) + 1.5 / (R * R * R * R * R) * pow(dot(r.xyz, v.xyz), 2.0);
		float spd = dot(r.xyz, v.xyz) / (R - 1.0) / (R * R);
		
		vec4 a = vec4(
			r.x * pos + v.x * spd,
			r.y * pos + v.y * spd,
			r.z * pos + v.z * spd,
			v.w * dot(r.xyz, v.xyz) / (2.0 * (R - 1.0) * R * R)
		);
		
		v += a * stp;
	}
	
	gl_FragColor = abs(color).rgra;
}