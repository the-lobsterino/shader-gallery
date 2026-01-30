#ifdef GL_ES
precision mediump float;
#endif
// tomaes 2014.11
//tigrou (ind) 2012.08.22, based on http://pouet.net/prod.php?which=59786
uniform float time;
uniform vec2 resolution;

vec4 calc_color(float _t)
{
   vec2 p = ( (gl_FragCoord.xy-resolution.xy/2.0) * (sin(_t)*mod(_t,30.0) ) ) + 100.0;
	
   float c = (p.y/p.x)*0.001 + log(p.y/p.x)+log(p.y/p.x)-((p.y*0.2))-sin(_t*0.1+p.x*0.002)*1.0;
	
   float d = clamp(mod(atan(p.x,p.y),0.1) * sin(_t*0.005),-2.0,5.0);
   
   c = (sin(p.y*0.201+c))+(sin(p.y*0.0015)/4.0);	

   if (c < 0.1) c = 0.35;	
   if (c < 0.3) c = 0.1;
   if (c > 0.5) c = 0.4 + sin(_t*2.0+distance(gl_FragCoord.xy,resolution.xy/2.0)*0.05)/4.0 + d;
	
   return vec4(d,c*0.4,c,1.0);
}


void main( void ) 
{

  vec4 c1,c2;
   
  c1 = calc_color(time);	
  c2 = calc_color(time+0.05);	
	
   gl_FragColor = mix(c1,c2,0.4);

}