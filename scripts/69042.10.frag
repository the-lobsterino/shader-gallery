#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rectangle(vec2 p,vec2 size)
{
	return step(max(abs(p.x)-size.x,abs(p.y)-size.y),0.1);
}

//PerlinNoise
float rand(vec2 st)
{
	  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

float PerlinNoise(float x)
{
	float aL = rand(vec2(floor(x), 0.1));
	float aR = rand(vec2(floor(x + 1.0), 0.1));
	float wL = aL * fract(x);
	float wR = aR * (fract(x) - 1.0);
	float f = fract(x);
	float u = pow(f, 2.0) * (3.0 - 2.0 * f);
	float n = mix(wL, wR, u);
	return n;
}

vec3 hsv2rgb(float h,float s,float v)
{
	return ((clamp(abs(fract(h+vec3(0,2,1)/3.)*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
	vec4 col=vec4(0,0,0,1);
	float theta=atan(position.y,position.x);
	float len=distance(position,vec2(0.5,0.5))+distance(vec2(0.5,0.5),position)+PerlinNoise(theta+time*2.0);
	col.rgb=vec3(step(0.999,sin(len*40.0)));
	
	
	
	col.rgb=hsv2rgb(len,1.0,0.5);
	//col.rgb=mix(vec3(1.0,0.0,0.0),vec3(0.0,0.0,1.0),len);
	col.rgb*=(0.8+PerlinNoise(theta+time)>len)? 1.0:0.0;
	
	gl_FragColor = col;
}