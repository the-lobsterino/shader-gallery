#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 		3.14159
#define THICKNESS 	0.02

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float plot(vec2 uv, float fn){
  return  smoothstep( fn-THICKNESS, fn, uv.y) -
          smoothstep( fn, fn+THICKNESS, uv.y);
}

float Hash( vec2 p,  float s)
{
    vec3 p2 = vec3(p.xy,10.0 * abs(sin(s)));
    return fract(sin(dot(p2,vec3(27.1,61.7, 12.4)))*273758.5453123);
}

float noise(vec2 p, float s)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * f * (3.0-2.0*f);

    return mix(mix(Hash(i + vec2(0.,0.), s), Hash(i + vec2(1.,0.), s),f.x),
               mix(Hash(i + vec2(0.,1.), s), Hash(i + vec2(1.,1.), s),f.x),
               f.y) * s;
}

float factor(float len, float s, float e){
	float v1 = 1.0 - 1.0 / exp(pow((s-len) * 6.0,2.0));
	v1 = clamp(v1, 0.0, 1.0);
	float v2 = 1.0 - 1.0 / exp(pow((len-e) * 6.0,2.0));
	v2 = clamp(v2, 0.0, 1.0);
	return (1.0-step(len,s))*v1 * (step(len,e))*v2;
}

float fbm(vec2 uv,float t,float len){
     float v = 0.0;
     vec2 p = uv+t;
     v += noise(p*.5, 0.35);
     v -= noise(p*2., 0.25);
     v -= noise(p*4., 0.125);
     v += noise(p*8., 0.0625);
     return v*factor(length(uv),0.0,len);
}

vec2 rotate(vec2 uv,float degree){
	mat2 rot = mat2(cos(degree),-sin(degree),sin(degree),cos(degree));
	return rot*uv;
}

void main( void ) {
	float size = min(resolution.x, resolution.y);
	vec2 uv = gl_FragCoord.xy / size * 2.0 - resolution/size;
	vec2 touch = mouse * 2.0 - 1.0;
	uv = rotate(uv,atan(touch.y,touch.x));
	
	float timeMult = 0.5;
	vec3 finalColor = vec3( 0.0 );
	float t = 0.02 / distance(uv, vec2(clamp(uv.x,0.0,length(touch)),fbm(uv,time*timeMult,length(touch))));
	
	finalColor = t * vec3( 0.2, 0.3, 0.5 );
	gl_FragColor = vec4( finalColor, 1.0 );

}