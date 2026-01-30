#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
#define rays 15.

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p -= 0.5;
	//p*=10.;
	
	vec3 color = vec3(abs(cos(fract(time)*40.)), abs(sin(fract(time)*20.)), abs(cos(fract(time)*10.)));
	
	vec3 col = color;
	
	//vec2 q = vec2(0, 0) - p;
	//float r = 0.12 + 0.09 * sin( atan(q.x, q.y) * 10.0 );
	//col *= smoothstep(r, r+0.01 , length( q ));
	

	vec2 q;
	float k,r;
	for(float i = .8; i < rays; i++)
	{
		k = abs(p.x + 0.5) * 6. - 3.;
		q = rotate2d(i/rays*PI ) * p;

		q.y = abs(q.y);
//		if(q.y > 0.)
		{

		r = 0.01 * (0.4 * max(cos(i), .4) - q.y);

		col *= smoothstep(r, r+.001, abs(q.x + 0.1 * sin(k * q.y)));
		}
	}
	
	col = color - col;
	gl_FragColor = vec4( col, 1.0 );

}