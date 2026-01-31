// less dogshit, more sweet as a nut - kk thx
// sABS version

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define less(a,b,c)      mix(a,b,step(0.,c))
#define sabs(x,k) less((.5/k)*x*x+k*.5,abs(x),abs(x)-k)
mat2 Rot(float a){
	float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
void main( void ) {
	vec2 position = 2.0 * ( gl_FragCoord.xy / resolution.xy ) -1.0;
	position.x *= resolution.x / resolution.y;
	
	position *= Rot(time*0.3+position.x*0.2);
	
	position = sabs(position,0.05);
	
	float d  = length(position+ vec2(1.0,0.0)) - 0.5;
	float d2  = length(position- vec2(1.0,0.0)) - 0.5;
	
	vec2 offset = vec2(sin(position.y*8.0+time*1.3),cos(position.x*8.0+time));
	offset = sabs(offset,0.7);
	offset *= 0.45;
	
	float d3  = length(position-offset) - .3;
	d = smin(d, d2,0.45);
	d = smin(d,d3,0.3+sin(time)*0.125);
	d = sin(d * 15.0 - time);
	
	d = sabs(d,.5);
	d = 0.55 / d;
	gl_FragColor = vec4(d*0.78, d*.51, d*0.4, 1.0);

}