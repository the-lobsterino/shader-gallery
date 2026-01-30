#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 f = gl_FragCoord.xy;
	vec2 dist = mouse * resolution - f;
	float d = dist.x * dist.x + dist.y * dist.y;
	if(d > 1000.0)
		{d = 1.0;}
	else
	{d/= 1000.0;}
	
	float g = gl_FragCoord.x / resolution.x;
	
	d -= g * d;
	
	if(d <= 0.0)
	{d = 0.0;}
	
	gl_FragColor = vec4( d,d,d,1.0);

}