#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float Hash( vec2 p,  float s)
{
    vec3 p2 = vec3(p.xy,360.0 * abs(sin(s)));
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

float fbm(vec2 p)
{
     float v = 0.0;
     v -= noise(p*.9, 0.35);
     v -= noise(p*2., 0.25);
     v -= noise(p*100.,0.25);
     v -= noise(p*5., 0.25);
     v -= noise(p*8., 0.25);
     v -= noise(p*1., 0.125);
     v -= noise(p*8., 0.0625);
     return v;
}

void main( void ) {
	
	float asp = resolution.x/resolution.y;
	vec2 uv = vec2(gl_FragCoord.x/resolution.x*asp,gl_FragCoord.y/resolution.y);
	
	float c = -abs(sin(time*20.-uv.x*100.))-fbm(uv+time);
	
	vec4 outC = vec4(c,0.,0.,1.);
	

	gl_FragColor = outC;

}
								    
								    
								    
								    
								    
								    
								    