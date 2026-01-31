//ändrom3da


#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

//#define t time

#define number   24.0
#define size     1.0
//#define border   1.50
#define speed    1.25
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
uniform float time;
uniform vec2 resolution;


vec2 N22(vec2 p) { vec3 a = fract(p.xyx*vec3(123.34, 234.34, 345.65)); 	a += dot(a, a+34.45);	return fract(vec2(a.x*a.y, a.y*a.z));}
vec3	hueShift( float h )
	{ vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }
vec3 firePalette(float i) {   float T = 1000. * (3.-i);   vec3 L = vec3(7.4, 5.6, 68.);   L = pow(L, vec3(5.0)) * (exp(1.43876719683e5 / (T * L)) - 1.0);  return 1.0 - exp(-5e8 / (L/1.)); }

void main(void) {
	float t = time + 100.;
        vec2 uv = 2.*(gl_FragCoord.xy- resolution/2.)/resolution.y;
        uv *= rot( time/2. );
	//uv *= .15/dot( uv, uv );
	vec3 color = vec3(0.0);
	float m = .0;
	float minDist = 0.125;
	for (float i = 2.5; i < number + 1.0; i++)
	{
		vec2 n = N22(vec2(i)+10.);
		//vec2 n = vec2(0.125*i+0.2, 0.125*i);
		vec2 p = 1.01/log2(n*n * t * speed);
		
		float d = length(uv/size - p);
		//m += smoothstep(0.015, 0.01, d);
		
		minDist = min(d, minDist);
		minDist = (8./i)*d * 6.*(1.-.95) * sqrt(minDist)-0.005*minDist;
		//minDist = minDist-(i/3000000000.);   // optional
		//minDist = pow(minDist, 1.0051);      // optional
	}
	
	color = vec3(0.0, 0.2 - sin(minDist), 0.4 - (1.*minDist)) * 1.9;
	float tww = 1.1;
	//color += step(minDist, tww/3.) * step(tww/3.-(0.02 * border), minDist) * vec3(0.0, 1.0, 0.4);
	
		
	for (float i = 1.0; i < number + 1.0; i++)
	{
		vec2 n = N22(vec2(i)+10.000014);
		//vec2 n = vec2(0.125*i+0.2, 0.125*i);
		vec2 p = sin(n * t * speed);
		
		float d = .5-.11/length(uv/size - p);
		//m += smoothstep(0.015, 0.01, d);
		
		minDist = min(d, minDist);
		minDist = d * 1.11 * minDist;
		//minDist = minDist-(i/3000000000.);   // optional
		//minDist = pow(minDist, 1.0051);      // optional
	}
	
	color += vec3(0.0, 0.099 - pow(minDist,0.5), 0.1 - minDist) * 1.8;
	
	//if (color.b >= 0.4) { color.g *= 1.22; color.b *= 1.11; }
	color *= 3.;

	#define c color
	//c = 1. - c;
	c *= hueShift( +22222.5 );
	c = 1. - cos(firePalette( c.y-.1*c.z )/2.);
	
	
	c *= 20.;
	color = 1. - exp( -color/5. );
	c *= hueShift( -1./1.485 );
	c = 1. -9.*sin( 1.-cos(c*4.-.1) );
	//c = 1. - exp( c );
	c = firePalette( (c.x-.221)+.421*c.y*(.1+sin(c.z-(288.1)*c.x)) ); c = 1. - c/1.111;
	//c *= hueShift( -.873 );
	c = 1. - c;
	gl_FragColor = vec4(color, 1.0);//ändrom3datwistonhisdirtyoldshyt

}