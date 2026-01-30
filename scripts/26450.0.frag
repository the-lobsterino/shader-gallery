#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float MAX_ITERS = 500.0;
bool insideCircle(vec2 position)
{
	bool val = (position.x - resolution.x)*(position.x - resolution.x) + (position.y-resolution.y)*(position.y-resolution.y) < 256.0;
	return val;
}

bool isInDomain(highp vec2 position)
{
	position -= cos(time)*.001/position/dot(position,position);
	return position.x * position.x + position.y*position.y < 4.0;
}
void main( void ) {

	highp vec2 position = ( gl_FragCoord.xy) + (mouse) * resolution - resolution.x/2.0 -resolution.y/3.0;
	position = position.yx * .51 + .25;
	highp float zoom = 1.0;
	highp float iter = 0.0;
	highp vec2 z = vec2(0.0,0.0);
	highp vec2 delta = vec2(4.0 / resolution.x,4.0/resolution.x);
	highp vec2 c = position * delta / zoom;

	bool done = false;
	for(highp float i = 0.0; i < MAX_ITERS; i++)
	{
		vec2 newz = z;
		newz.x = z.x*z.x - z.y*z.y;
		newz.x = newz.x + c.x;
		newz.y = 2.0*z.x*z.y;
		newz.y = newz.y + c.y;
		
		if(!isInDomain(newz))
		{
			iter = i;
			break;
		}
		z = newz;
	}
	if(iter == 0.0)
		iter = MAX_ITERS;
	
	float green = (MAX_ITERS - iter)/MAX_ITERS * length(z*.75);
	green = fract(.5-green);
	gl_FragColor = vec4(0.0, green,0.0,1.0);

}