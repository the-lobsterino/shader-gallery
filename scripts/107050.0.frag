// less dogshit, more sweet as a nut - kk thx

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
void main( void ) {

	vec2 position = 2.0 * ( gl_FragCoord.xy / resolution.xy ) -1.0;
	position.x *= resolution.x / resolution.y;
	float d  = length(position+ vec2(1.0,0.0)) - 2.;
	float d2  = length(position- vec2(1.0,0.0)) - 0.5;
	float d3  = length(position-vec2(0.0,sin(time*1.4)*0.25)) - 0.125;
	d = smin(d, d2,0.65);
	d = smin(d,d3,0.3+sin(time)*0.125);
	d = sin(d * 15.0 - time);
	//d =  smoothstep(0.48, 0.50, d) -smoothstep(0.50, 0.52, d) ;
	d = 0.2 / (d*d);
	gl_FragColor = vec4(d*0.66, d*1.1, d*0.55, 1.0);

}