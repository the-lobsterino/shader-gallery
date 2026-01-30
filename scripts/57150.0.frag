#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

float wibble(vec2 p)
{
	float sy = 0.1 * (p.x * p.x * 5.0 - 0.7) * cos(45.0 * p.x - 15.0 * pow(time*30.0, 0.4) * 20.0);
	
	//float dx = 1.0 / (3.0 * abs(p.y - sy));
//	float dx = 1.0-abs(p.y-sy);
	
//	float dx = 1.0-smoothstep (0.0,0.04,abs(p.y*p.y*4.0-sy));

	//sy =(sy*sy)*45.0;
	
	float dx = 1.0-smoothstep (0.0,0.04,abs(p.y-sy));

	
	
	return dx;
	
}

void main( void )
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy) - 0.5;
	float dx = wibble(p);
	
	gl_FragColor = vec4(dx,dx,dx, 1.0);
}



