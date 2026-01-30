#ifdef GL_ES
precision mediump float;
#endif
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rect(vec2 pos)
{
	return float(abs(pos.x) < 1.0 && abs(pos.y) < 1.0);
}

float numWithBitmask(vec2 pos, int bit)
{
	float color = 0.0;
	color += rect((pos + vec2( 0.0 ,-0.04)) * vec2(50.0, 300.0)) * mod(float(bit     ), 2.0); // -
	color += rect((pos + vec2( 0.02,-0.02)) * vec2(300.0, 50.0)) * mod(float(bit / 2 ), 2.0); // |
	color += rect((pos + vec2(-0.02,-0.02)) * vec2(300.0, 50.0)) * mod(float(bit / 4 ), 2.0); // |
	color += rect((pos + vec2( 0.0 , 0.0 )) * vec2(50.0, 300.0)) * mod(float(bit / 8 ), 2.0); // -
	color += rect((pos + vec2( 0.02, 0.02)) * vec2(300.0, 50.0)) * mod(float(bit / 16), 2.0); // |
	color += rect((pos + vec2(-0.02, 0.02)) * vec2(300.0, 50.0)) * mod(float(bit / 32), 2.0); // |
	color += rect((pos + vec2( 0.0 , 0.04)) * vec2(50.0, 300.0)) * mod(float(bit / 64), 2.0); // -
	return color;
}

float num(vec2 pos, int n)
{
	bool r1 = n == 0           || n == 2;
	bool r2 = n == 0 || n == 1;
	bool r3 = n == 0           || n == 2;
	bool r4 =                     n == 2;
	bool r5 = n == 0 || n == 1 || n == 2;
	bool r6 = n == 0;
	bool r7 = n == 0           || n == 2;
	
	float color = 0.0;
	color += rect((pos + vec2( 0.0 ,-0.04)) * vec2(50.0, 300.0)) * float(r1); // -
	color += rect((pos + vec2( 0.02,-0.02)) * vec2(300.0, 50.0)) * float(r2); // |
	color += rect((pos + vec2(-0.02,-0.02)) * vec2(300.0, 50.0)) * float(r3); // |
	color += rect((pos + vec2( 0.0 , 0.0 )) * vec2(50.0, 300.0)) * float(r4); // -
	color += rect((pos + vec2( 0.02, 0.02)) * vec2(300.0, 50.0)) * float(r5); // |
	color += rect((pos + vec2(-0.02, 0.02)) * vec2(300.0, 50.0)) * float(r6); // |
	color += rect((pos + vec2( 0.0 , 0.04)) * vec2(50.0, 300.0)) * float(r7); // -
	return numWithBitmask(pos, 119);
}

void main( void ) {
 
	vec2 pos = (gl_FragCoord.xy - resolution * 0.5)  / resolution.y;
	
	float color = 0.0;
	color += num(pos, 0);
	
	gl_FragColor = vec4(color, color, color, 0.0);
}