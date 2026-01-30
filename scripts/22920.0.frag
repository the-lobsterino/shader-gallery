#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5) * 2.5;
	position.x *= (resolution.x / resolution.y);
	
	vec3 color = vec3(0.0, 0.0, 0.0);
	
	float zx = position.x;
	float zy = position.y;
	float zxsq = zx * zx;
	float zysq = zy * zy;
	float cx = mouse.x * 2.0 - 1.0;
	float cy = mouse.y * 2.0 - 1.0;
	
	for(int i = 0; i < 100; i++)
	{
		zy = 2.0 * zx * zy + cy;
		zx = zxsq - zysq + cx;
		zxsq = zx * zx;
		zysq = zy * zy;
		
		if(zxsq + zysq > 4.0)
		{
			float fI = float(i) + 1.0 - log(log(sqrt(zxsq + zysq)) / log(2.0)) / log(2.0);
			color = vec3((-cos(fI * 0.38) - 0.5) * 2.0, (-cos(fI * 0.08) - 0.5) * 2.0, (-cos(fI * 0.24) - 0.5) * 2.0);
			break;
		}
	}
	
	gl_FragColor = vec4(color, 1.0);

}