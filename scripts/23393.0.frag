#ifdef GL_ES
precision highp float;
#endif

#define EPS	0.0001
#define ITERS	128
#define CORONA 0.1

uniform sampler2D backbuffer;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Material {
	float sample;
	vec3 color;
};
	
highp float rand(vec2 co)
{
    return 1.0;
}
	
float circle(vec2 pos, float radius)
{
	return max(0., length(pos) - radius);	
}

Material calculate(vec2 pos)
{
	float d;
	
	d = circle(pos, 0.25); if (d < EPS) return Material(d, vec3(0.56,0.2,0.15));
	d = min(d, circle(pos + vec2(0.5,0.5), 0.25)); if (d < EPS) return Material(d, vec3(0.56,0.2,0.15));
	
	return Material(d, vec3(0.4));
}


float light(vec2 pos, vec2 lightPos)
{
	lightPos += vec2(rand(gl_FragCoord.xy + sin(time*0.4783)), rand(gl_FragCoord.yx + sin(time*0.5667))) * CORONA - vec2(CORONA/2.);
	vec2 dir = normalize(pos - lightPos);
	vec2 start = lightPos;
	
	for (int i = 0 ; i < ITERS ; i++)
	{
		float sample = calculate(lightPos).sample;
		
		if (sample < EPS)
		{
			return 0.;
		} else if (distance(lightPos, pos) < sample)
		{
			return 1./distance(pos, start)*CORONA;	
		}
		
		lightPos += dir * sample;
	}
	return 1.;
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5);
	position *= 2.;
	position.x *= resolution.x / resolution.y;

	
	vec2 m = mouse.xy - vec2(0.5);
	m *= 2.;
	m.x *= resolution.x / resolution.y;

	gl_FragColor = vec4( calculate(position).color * 
			    (light(position, vec2(m)) * vec3(1.0,0.0,0.2) +
			     light(position, vec2(m) + vec2(sin(time),cos(time))*0.3) * vec3(0.52,1.0,0.3))
			    , 1.0 );
	
	gl_FragColor = (gl_FragColor + 8.0*texture2D(backbuffer, gl_FragCoord.xy/resolution))/9.0 ;

}