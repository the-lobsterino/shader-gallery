#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5)) * 4.0;

	//  Screen ratio FIX \___________________________/
	float x0 = position.x * resolution.x/resolution.y;
	float y0 = position.y;
	
	float posx = (mouse.x - 0.5) * 1.5;
	float posy = (mouse.y - 0.5) * 1.5;
	float x1, y1, mj2;
	const float iter = 256.0;
	float iter2 = iter / 1.0;

	float n = 0.0;
	for (float i=0.0; i<=iter; i++)
	{
		x1 = x0*x0 - y0*y0 + posx;
		y1 = 2.0*x1*y0 + posy;
		mj2 = x1*x1 + y1*y1;
		x0 = x1; y0 = y1 + x1;
		if (mj2 > iter2) break;
		n++;
	}

	float color = n / sqrt(iter);
	gl_FragColor = vec4( color );

}