#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle( vec2 uv, float radius )
{
	return 1.0 - length( (uv) / radius );
}

float random(float x)
{
	return clamp(fract(sin(x) * 2389.4392), 0.0, 1.0 );
}

float noise( vec2 uv )
{
	vec2 p = floor(uv);
	vec2 f = fract(uv);
	
	f = f*f*(3.0 - 2.0*f);
	
	float n = p.x + p.y*157.0;
	float t = mix(
			mix(random(n+0.0), random(n+1.0), f.x),
			mix(random(n+157.0), random(n+158.0), f.x),
		f.y);
	
	return t;
}

vec3 fireball(vec2 uv, vec3 tone)
{
	float nx = 0.0;
	float ny = 0.0;
	
	for(int i = 0; i < 8; ++i)
	{
		float ii = pow(float(i), 2.0);
		float currentIteration = float(i)/24.0;
		float d = (1.0 - currentIteration) * 0.04;
		float t = currentIteration * time * 4.0;
		nx += (sin(noise(vec2( uv.x * ii - time * currentIteration, uv.y * ii - t )) * d));
		ny += noise(vec2( uv.x * ii + time * currentIteration, uv.y * ii - t )) * d;
		
	}
	
	float shape = clamp(circle(vec2(uv.x + nx, uv.y + ny), 0.5), 0.0, 1.0);
	
	vec3 finalColor = pow(shape, 5.0) * tone;
	
	return finalColor;
}

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= (resolution.x / resolution.y);
	
	uv /= 2.0;
	
	vec3 finalColor = fireball(uv, vec3(15.0, 1.5, 0.6) ) * 1.5;

	gl_FragColor = vec4( finalColor, 1.0 );

}