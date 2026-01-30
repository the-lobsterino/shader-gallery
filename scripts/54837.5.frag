
// https://www.shadertoy.com/view/4lfXRf


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;





#define NUM_PARTICLES	10
#define NUM_FIREWORKS	5

vec3 pow3(vec3 v, float p)
{
    return pow(abs(v), vec3(p));
}

float Noise1(vec2 point)
{
  point = fract(point * vec2(233.42, 865.32));
	
  point += dot(point, point + 32.33);
	
  return fract(point.x * point.y);
}

vec2 Noise2(vec2 point)
{
  float noise = Noise1(point);
	
  return vec2(noise, Noise1(point + noise));
}

vec3 fireworks(float time, vec2 p)
{
    vec3 color = vec3(0., 0., 0.);
    
    for(int fw = 0; fw < NUM_FIREWORKS; fw++)
    {
        vec2 pos = Noise2(vec2(0.82, 0.11)*float(fw))*1.5;
    	float time2 = mod(time*3., 6.*(1.+Noise2(vec2(0.123, 0.987)*float(fw)).x));
        for(int i = 0; i < NUM_PARTICLES; i++)
    	{
        	vec2 dir = Noise2(vec2(0.512, 0.133)*float(i));
            dir.y -=time2 * 0.1;
            float term = 1./length(p-pos-dir*time2)/50.;
            color += pow3(vec3(
                term * Noise2(vec2(0.123, 0.133)*float(i)).y,
                0.8 * term * Noise2(vec2(0.533, 0.133)*float(i)).x,
                0.5 * term * Noise2(vec2(0.512, 0.133)*float(i)).x),
                          1.25);
        }
    }
    return color;
}

vec3 flag(float time, vec2 p)
{
    vec3 color;
    
    p.y += sin(p.x*1.3+time)*0.1;
    
    if(p.y > 0.) 	color = vec3(1.);
    else			color = vec3(1., 0., 0.);
    
    color *= sin(3.1415/2. + p.x*1.3+time)*0.3 + 0.7;
    
    return color * 0.15;
}

//void mainImage( out vec4 fragColor, in vec2 fragCoord )
//{
//	vec2 p = 2. * fragCoord / iResolution.xy - 1.;
//    p.x *= iResolution.x / iResolution.y;
//    
//    vec3 color = fireworks(p) + flag(p);
//    fragColor = vec4(color, 1.);
//}





void main( void )
{

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 4.0;
	
	//p.x *= resolution.x / resolution.y;

	vec3 color = fireworks(time, p) + flag(time, p);

	gl_FragColor = vec4(color, 1.0);
}