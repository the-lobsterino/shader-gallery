#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float Hash( vec2 p)
{
     vec3 p2 = vec3(p.xy,1.0);
    return fract(sin(dot(p2,vec3(37.1,61.7, 12.4)))*3758.5453123);
}

float noise(in vec2 p)
{
	vec2 i = floor(p);
	vec2 f = fract(p);
	f *= f * (3.0-2.0*f);
	return mix(mix(Hash(i + vec2(0.,0.)), Hash(i + vec2(1.,0.)),f.x),
               mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)),f.x),
               f.y);
}
vec2 noise2d(in vec2 p)
{
	return vec2(noise(p),noise(p));
}

float fbm(vec2 p)
{
     float v = 0.0;
     v += noise(p*1.0)*.5;
     v += noise(p*2.)*.25;
     v += noise(p*4.)*.125;
     return v * 1.0;
}
float line( in vec2 p, in vec2 a, in vec2 b){
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float d = length( pa - ba*h );
	return step(0.02,d);
}
void main( void ) {
	vec2 Texcoord = gl_FragCoord.xy/resolution.xy;
	//float t = mod(time/2.,1.0);
	//ここから下
	
	float a;
	vec4 c;
	
	a = noise(Texcoord*7.0+time);
	a = 0.4/a/10.0;
	c = vec4(a,0.5,0.1,1.0);

	c = vec4(noise2d(Texcoord+time),1.0,1.0);
	//c = vec4(line(noise2d(Texcoord),vec2(0.0),vec2(1.0)));
	//ここから上
	
	gl_FragColor = c;

}