#ifdef GL_ES
precision mediump float;
#endif
//Some Bubbles
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 pos, float rad, vec2 sPos)
{
	return step(length(sPos-pos),rad);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);
	position.x*=resolution.x/resolution.y;
	
	float color = 0.0;
	for(int i = -10; i <20; i++)
	{
		float fi = float(i);
		float x = pow(fi,0.221235);
		float y = pow(fi,0.54421);
		vec2 pos = vec2(fract(x)*2.0-0.5,fract(y)*2.0-0.5);
		color += circle(pos,abs(cos(time+float(i))*0.25) + 0.128,position + vec2(sin(time/4.0+fi),cos(time/4.0+fi)));
	}
	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}