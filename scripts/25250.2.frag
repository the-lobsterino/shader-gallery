#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;
// Modified by gigatron Starscroll v0.0.0.1.1.33285455 !!!
// Clean up code

float field(in vec3 p,float s,  int idx) {
   float strength = 7. + .03 * log(1.e-6 + fract(sin(time) * 4373.11));
   float accum = s/4.;
   float prev = 0.;
   float tw = 0.;
   for (int i = 0; i < 26; ++i) {
      float mag = dot(p, p);
      p = abs(p) / mag + vec3(-.5, -.4, -1.5);
      float w = exp(-float(i) / 7.);
      accum += w * exp(-strength * pow(abs(mag - prev), 2.2));
      tw += w;
      prev = mag;
   }
   return max(0., 1. * accum / tw - .7);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(2.9898,7.233))) * 8.5453);
}

vec3 nrand3( vec2 co )
{
   vec3 a = fract( sin( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );
	
	
	
   vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );
   vec3 c = (a* b)*1.05;
   return c;
}


void main()
	
{
    vec2 uv = 2. * gl_FragCoord.xy / resolution.xy - 1.;
   vec2 uvs = uv * resolution.xy / max(resolution.x, resolution.y);
   vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);
   p += .1 * vec3(time/14., 0.,  0.);
  
   
   float freqs[4];
   freqs[0] = 0.05;
   freqs[1] = 0.3; 
   freqs[2] = 0.3;
   freqs[3] = 0.3; 
   
   float t = field(p,freqs[0], 26);
   float v = (1. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));
   
    //Second Layer
   vec3 p2 = vec3(uvs / (4.+1.), 1.5) + vec3(2., -1.3, -1.);
   p2 += 0.25 * vec3(time / 16., 1.0,  1.0);

   
   // layer 3	
   vec3 p3 = p2;
   p3 += 0.25 * vec3(time / 12., 1.0,  1.0);
  
  
   //layer 4	
   vec3 p4 = p2;
   p4 += 0.25 * vec3(time / 08., 1.0,  1.0);

	
	
	
	
   
   //Let's add some stars
   //Thanks to http://glsl.heroku.com/e#6904.0
   vec2 seed = p.xy * 2.0;   
   seed = floor(seed * resolution.x);
   vec3 rnd = nrand3( seed );
   vec4 starcolor = vec4(pow(rnd.y,60.0));
  
   //Second Layer
   vec2 seed2 = p2.xy * 2.0;
   seed2 = floor(seed2 * resolution.x);
   vec3 rnd2 = nrand3( seed2 );
	
	vec2 seed3 = p3.xy * 2.0;
 	 seed3 = floor(seed3 * resolution.x);
	vec3 rnd3 = nrand3( seed3 );
	
	vec2 seed4 = p4.xy * 2.0;
 	 seed4 = floor(seed4 * resolution.x);
	vec3 rnd4 = nrand3( seed4 );
	
	
	
	
	
	starcolor += vec4(pow(rnd2.x*1.02,60.0));
	starcolor += vec4(pow(rnd3.x*1.02,60.0));
	starcolor += vec4(pow(rnd4.x*1.02,60.0));
  
	gl_FragColor = vec4((1.0 , 1.0, t+starcolor ));
}