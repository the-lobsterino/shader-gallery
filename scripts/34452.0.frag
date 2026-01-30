#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float dir(vec2 a, vec2 b)
{
	return a.x * b.y - a.y * b.x;
}

bool insidTri(vec2 p,  vec2 a, vec2 b, vec2 c)
{
	//cross product
	bool b1 = dir(p - a, b - a) > 0.0;
	bool b2 = dir(p - b, c - b) > 0.0;
	bool b3 = dir(p - c, a - c) > 0.0;
	
	return b1 == b2 && b2 == b3;
}

float rand(vec3 xyz)
{
	return (-0.5 + fract(sin(xyz.x*23568.65463+xyz.y*540735.40753+xyz.z*69324.63436)*36476.4577 + sin(xyz.x) + time * 0.3)) * 2.0;	
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy);
	
	//0 ~ 1 to -1 ~ 1
	p = p * 2.0 - 1.0;
	//for aspect ratio
	p.x *= resolution.x / resolution.y;
	
	vec4 col = vec4(0.0);
	
	for(int i = 0 ; i < 50; i++)
	{
		vec2 a = vec2(rand(vec3(float(i * 3),   float(i * 5), -float(i * 4))),  rand(vec3(float(i *   3),  float(i * 2), float(i * 16))));
		vec2 c = vec2(rand(vec3(float(i * 4),  float(i * 2), float(i * 2))),    rand(vec3(float(i * -46), -float(i * 5), float(i * 3))));
		vec2 b = vec2(rand(vec3(-float(i * 97), float(i * 85), float(i * 2))), -rand(vec3(float(i *  -9),  float(i * -2), float(i * -2))));
		
		if(insidTri(p, a, b, c)) col += vec4(
			rand(vec3(float(i * -9), float(i * 2), float(i * 2))),
			rand(vec3(float(i + -5), float(i * 7), float(i * 5))),
			rand(vec3(float(i - -2), float(i * 4), float(i * 6))),
			rand(vec3(float(i * -5), float(i * 3), float(i * 7)))
		) * 0.5;
	}
	
	gl_FragColor = vec4(vec3(1) - abs(vec3(col)), 1.0);

}