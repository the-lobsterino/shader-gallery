#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float glow(vec2 p, vec2 center,float radius, float maxintensity)
{
	float r = (0.005/abs(distance(p, center)-radius + 0.01));
	if (r > maxintensity)
		return maxintensity;
	else
		return r;
}

float tt()
{
	float r = -tan(time * 6.0);
	if (r > 1.0)
		r = 1.0;
	if (r <= 0.0)
	    r = 0.0;
	return r;
}

vec4 collide(vec2 p, vec2 center, float radius, float angle)
{
	vec2 p2 = vec2(center.x * radius / 0.1, center.y + sin(angle) * radius / 0.1);
	float r = ((0.00007 * tt())/abs(distance(center, p)-radius + 0.01));
	
	
	r = r / distance(p2, p);
	
	if (r > 1.0)
		r = 1.0;
	
	return vec4(1.0, 1.0, 1.0, 1.0) * r;
}

void main( void ) 
{
	vec2 clampc = gl_FragCoord.xy / resolution.xy;
	vec2 clampm = mouse;
	clampm.x *= (resolution.x/resolution.y);
	clampc.x *= (resolution.x/resolution.y);
	
	gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
	gl_FragColor *= glow(clampc, clampm, 0.1, 1.0);
	gl_FragColor += collide(clampc, clampm, 0.1, 0.0);
	
}