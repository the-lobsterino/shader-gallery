#ifdef GL_ES
precision mediump float;
#endif

#define MAX_ITER 30

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 v_texCoord = gl_FragCoord.xy / resolution;
	
	vec2 p =  v_texCoord * 18.0;
	vec2 i = vec2(0.,mod(sqrt(p.y), 1.));
	float c = 1.0;
	float inten = .2;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time * (1.0 - (3.0 / float(n+1)));
		
		i = p + vec2(cos(t - i.x) + sin(t + i.y),
					 sin(t - i.y) + cos(t + i.x));
					 
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),
							 p.y / (cos(i.y+t)/inten)));
	}

	c /= float(MAX_ITER);

	vec4 texColor = vec4(0.0, 0.29, 0.50, 1.);
	
	texColor.rgb /=  c;
	
	gl_FragColor = texColor;
}