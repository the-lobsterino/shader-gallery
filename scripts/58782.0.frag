
precision mediump float;

const float lineWidth = 4.0;

uniform float time;

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	float color = 1.0;
	
	if(mod(position.x, 64.0) <= lineWidth)
	{
		color = 1.0;
	}
	else if(mod(position.y, 34.0) <= lineWidth)
	{
		color = 0.7;
	}
	else
	{
		color = 1.6*sin(position.x*position.y+time*8.354)*0.5;
		color *= sin(time)+cos(time*10.34);
	}

	gl_FragColor = vec4( 0.1/color, color*1.4, 0.1/color*length(position), 1.0 );
}