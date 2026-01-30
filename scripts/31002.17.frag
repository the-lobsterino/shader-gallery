#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float dist(vec3 pos)
{
	float t = time * 2.;
	return  min(
		max(
		min(
		min(
		min(
		min(
			dot(pos, vec3(1, 0, 0)) + 10.0,
		  	dot(pos, vec3(-1, 0, 0)) + 10.0),
		   	dot(pos, vec3(0, 1, 0)) + 1.0),
		   	dot(pos, vec3(0, 0, 1)) + 10.0),
		   	dot(pos, vec3(0, 0, -1)) + 10.0),
		   	-dot(pos, vec3(0, -1, 0)) - 3.0),
			length(pos + vec3(cos(t), sin(t), 0) * 1.) - 0.5
		);
	
}


vec3 getNorm(vec3 pos)
{
	float d = 0.0001;
	return normalize(vec3(dist(pos + vec3(d, 0, 0)) - dist(pos - vec3(d, 0, 0)),
		              dist(pos + vec3(0, d, 0)) - dist(pos - vec3(0, d, 0)),
		              dist(pos + vec3(0, 0, d)) - dist(pos - vec3(0, 0, d))));
}

float rand(vec2 co, float seed){
    return fract(sin(dot(vec3(co, seed), vec3(12.9898,78.233, 56.789))) * 43758.5453);
}

vec3 rayTrace(vec2 pos, float seed)
{
	vec3 color = vec3(0);
	vec3 dampColor = vec3(1);
	float t = time * 0.5;
	mat3 rot = mat3(cos(t), 0, sin(t), 0, 1, 0, -sin(t), 0, cos(t));
	vec3 rayPos = vec3(0, 0, -5) * rot;
	vec3 rayDir = normalize(vec3(pos.xy, 1) * rot);
	
	float depth = 0.;
	for(float i = 0.; i < 256.; ++i)
	{
		float d = dist(rayPos);
		rayPos += rayDir * d;
		if (dist(rayPos) < 0.001) 
		{
			vec3 norm = getNorm(rayPos);
			// 反射ベクトルを求める
			rayDir = normalize(rayDir - 2. * dot(rayDir, norm) * norm);
			rayDir = normalize(rayDir);
			rayPos += rayDir * 0.01;
			dampColor *= clamp(dist(rayPos) * 20. + 0.7, 0., 1.);
		}
		depth = i;
	}
	/*
	for(float i = 0.; i < 128.; ++i)
	{
		float d = dist(rayPos);
	}
	*/
	
	if (depth >= 255.) color = vec3(1., 1., 1.) * dampColor;
	//color = dampColor;
	return color;
}


void main( void ) {
	vec2 pos = (gl_FragCoord.xy - resolution.xy / 2.) / resolution.y;
	
	vec3 color = vec3(0.0);
	
	color += rayTrace(pos, time);
	
	gl_FragColor = vec4(color, 0);
}