#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float semilla = 0.0;
//Moving rectangles by Ruben Ibarra

vec3 generateRectangle(in vec2 position,in float x1,in float x2,in float y1,in float y2)
{
	

	if(position.x > x1 && position.x < x2 && position.y > y1 && position.y < y2)
		return vec3(fract(sin(dot(vec2(x2+floor(time/1.0),x2) ,vec2(x2,x2))) * 43758.5453)+position.x,fract(sin(dot(vec2(y2+floor(time/1.0),y2+floor(time/1.0)) ,vec2(x2,x2))) * 43758.5453)+position.x,fract(sin(dot(vec2(x2+1.0+floor(time/1.0),x2+1.0+floor(time/1.0)) ,vec2(y1+2.0,y1+2.0))) * 43758.5453)+position.x
			   );
	else
		return vec3(0.0,0.0,0.0);
}
void main( void ) {
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec3 color = vec3(0.0,0.0,0.0);
	float random = 0.0;
	for(float x = 0.0;x < 10.0;++x)
	{
		for(float y = 0.0;y < 10.0;++y)
		{
			color += generateRectangle(position,(x*10.0+0.0)/100.0,((x*10.0)/100.0) + 0.1,y/10.0,y/10.0 + 0.1);
		}
	}

	gl_FragColor = vec4(color, 1.0 );
}