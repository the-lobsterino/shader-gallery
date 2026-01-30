//ändrom3da


#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

//#define t time

#define number   64.0
#define size     1.0
//#define border   1.50
#define speed    1.50

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 N22(vec2 p) { vec3 a = fract(p.xyx*vec3(123.34, 234.34, 345.65)); 	a += dot(a, a+34.45);	return fract(vec2(a.x*a.y, a.y*a.z));}

vec3 firePalette(float i) {   float T = 1000. * (3.-i);   vec3 L = vec3(7.4, 5.6, 4.4);   L = pow(L, vec3(5.0)) * (exp(1.43876719683e5 / (T * L)) - 1.0);  return 1.0 - exp(-5e8 / (L/1.)); }

void main(void) {
	float t = time + 10.;
        vec2 uv = 1.*(gl_FragCoord.xy- resolution/2.)/resolution.y;
        //uv *= .15/dot( uv, uv );
	vec3 color = vec3(0.0);
	float m = 0.0;
	float minDist = 1.0;
	for (float i = 2.5; i < number + 1.0; i++)
	{
		vec2 n = N22(vec2(i)+10.);
		//vec2 n = vec2(0.125*i+0.2, 0.125*i);
		vec2 p = sin(n * t * speed);
		
		float d = length(uv/size - p);
		//m += smoothstep(0.015, 0.01, d);
		
		minDist = min(d, minDist);
		minDist = 0.5*d * 6.*(1.-.95) * sqrt(minDist)-0.005*minDist;
		//minDist = minDist-(i/3000000000.);   // optional
		//minDist = pow(minDist, 1.0051);      // optional
	}
	
	color = vec3(0.0, 0.2 - minDist, 0.4 - minDist) * 1.8;
	float tww = 1.1;
	//color += step(minDist, tww/3.) * step(tww/3.-(0.02 * border), minDist) * vec3(0.0, 1.0, 0.4);
	
		
	for (float i = 1.0; i < number + 1.0; i++)
	{
		vec2 n = N22(vec2(i)+10.000014);
		//vec2 n = vec2(0.125*i+0.2, 0.125*i);
		vec2 p = sin(n * t * speed);
		
		float d = length(uv/size - p);
		//m += smoothstep(0.015, 0.01, d);
		
		minDist = min(d, minDist);
		minDist = d * 1.11 * minDist;
		//minDist = minDist-(i/3000000000.);   // optional
		//minDist = pow(minDist, 1.0051);      // optional
	}
	
	color += vec3(0.0, 0.2 - pow(minDist,0.5), 0.1 - minDist) * 1.8;
	
	//if (color.b >= 0.4) { color.g *= 1.22; color.b *= 1.11; }
	color *= 3.;

	#define c color
	//c = 1. - c;
	c = firePalette( c.y-.1*c.z )/2.;
	if (c.x > .215 ) c = vec3( 0. );
	c *= 64.;
	color = 1. - exp( -color );
	gl_FragColor = vec4(color, 1.0);//ändrom3datwistonhisdirtyoldshyt

}