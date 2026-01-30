#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//random vec3 generator
vec3 nrand3( vec2 co )
{
   vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(5.3e5, 4.7e5, 2.9e5) );
   vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(1.15, 1.05, 0.1e5) );
   vec3 c = mix(a, b, 0.5);
   return c;
}

//star field generation
vec4 makeStars(vec2 v)
{
   //Let's add some stars
   //Thanks to http://glsl.heroku.com/e#6904.0
   vec3 p = vec3(v / 16., 0);// + vec3(1., -1.3, 0.);
   
//   p += .2 * vec3(time*0.0 + sin(time*0.0 / 16.), time*0.0 + sin(time*0.0 / 12.),  sin(time / 12.));
	
   vec2 seed = p.xy * 2.0;   
   seed = floor(seed * 1000.0);
   vec3 rnd = nrand3( seed );
   vec4 starcolor = vec4(pow(rnd,vec3(20)).xxx, 1.0);
    
   return starcolor;
}

//make a big star
vec4 makeBigStar()
{
  // Be Cool
  vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
  p.x *= resolution.x/resolution.y;
  float a = atan(p.x, p.y);
  float r = length(p);
 
  float b = 1.9 * sin(8.0 * r - time - 2.0 * a);
  b = 0.3125 / r + cos(7.0 * a * b + b * a) / (10.0 * r);
  b *= smoothstep(0.0, 0.8, b);
 
  vec4 star = vec4(b, 1.67 * b + 0.5*b*sin(a + time) , r*b, 1.0);
  return star;
}

//main entry point
void main( void ) {

   vec2 uv = 2. * gl_FragCoord.xy /*/ resolution.xy*/ - 1.;
   vec2 uvs = uv;// * resolution.xy / max(resolution.x, resolution.y);
  
   vec4 starfrags = makeStars(uvs);
	
   vec4 bigstar = makeBigStar();
	
   gl_FragColor = starfrags;// + bigstar;

}