
// SinusFunctionVariation

#ifdef GL_ES
precision mediump float; 
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;

float getFuncValue(float x)
{
	return 1.6*(sin(x+time)
		+ sin((x+time*4.432)/0.9) 
		+ sin((x+time*2.912)/1.1)/4.98 
		+ sin((x+time*3.876)/8.)/3.21
		+ sin((x+time*1.654)/16.)/2.22
		+ sin((x+time*7.211)/32.)/1.94
		+ sin((x+time*4.718)/64.)/7.33);
}

float getFuncValue2(float x)
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
	position.x = (position.x+mouse.x-1.0) * 160.0;
	position.y = (position.y - 0.5) * 100.0;
	
	vec3 color = vec3(0.0);
	float ratio = resolution.x / resolution.y;
	
	//vertical lines
	//if(abs(mod(position.x, 10.0)) < 0.10) color += vec3(0.4);
	//if(abs    (position.x)        < 0.3) color += vec3(0.4);
	
	// horizontal line
	//if(abs(mod(position.y, 10.0) / ratio) < 0.10) color += vec3(0.4);
	//if(abs(    position.y) < 0.3 / ratio) color += vec3(0.4);
	
	color += plot();

	gl_FragColor = vec4(color, 1.0 );
}