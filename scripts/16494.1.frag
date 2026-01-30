#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const int num = 10;
float rand(vec2 n)
{
	return fract(sin(n.x*5442.6542+n.y*5253.6531)*4334.5365);
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x);
	float scale = 2.5;
	float maxscale = 10.0;
	float color;
	float color2;
	float s;
	vec3 total;
	for(int i = 0; i < num; i++)
	{
		s = mix(scale,maxscale,float(i)/float(num));
		color = mix(rand(ceil(position*s)/s),rand(ceil(position*s+vec2(1,0))/s),mod(position.x*s,1.));
		color2 = mix(rand(ceil(position*s+vec2(0,1))/s),rand(ceil(position*s+vec2(1,1))/s),mod(position.x*s,1.));
		total += mix(color,color2,mod(position.y*s,1.));
	}
	total /= float(num);
	vec3 land = vec3(sign(0.5-total.g)*(total.g),sign(total.g-0.2)*total.g+clamp(sign(0.5-total.g)*(total.g),0.0,1.0),sign(0.5-total.g)*(1.0-total.g));
	gl_FragColor = vec4( land, 1.0 );
}