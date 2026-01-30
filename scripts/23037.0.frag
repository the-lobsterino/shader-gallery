#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;

float getFuncValue(float x)
{
	return abs(sin(x/10.0) * (x/10.0));	
}

vec3 plot()
{
	float val = getFuncValue(position.x);
	float dist = 0.4 / distance(position, vec2(position.x, val * (1.8+0.2*sin(time))));
	return vec3(dist, dist*0.2, 0.1);
}

void main( void ) 
{
	position = ( gl_FragCoord.xy / resolution.xy );
	position.y = position.y * resolution.y/resolution.x + 0.25;
	position.x = (position.x+mouse.x-1.0) * 200.0;
	position.y = (position.y - 0.4) * 100.0;
	
	vec3 color = vec3(0.0);
	float ratio = resolution.x / resolution.y;
	
	if(abs(position.x) < 0.2) color += vec3(0.4);
	if(abs(position.y) < 0.2 / ratio) color += vec3(0.4);
	
	color += plot();

	gl_FragColor = vec4(color, 1.0 );
}