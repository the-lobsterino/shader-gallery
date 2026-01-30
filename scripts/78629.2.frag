// --------------------------------------------
/* licenced under piece love and happiness licence */
// --------------------------------------------

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;


const int   complexity = 10;    // More points of color.
const float fluid_speed = 6.0; 

const float Pi = 3.14159;

vec3 hsb2rgb(vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x * 6. + vec3(0. , 4., 2.), 6.) - 3.) - 1., 0., 1. );
    rgb = rgb * rgb * (3. - 2. * rgb);
    return c.z * mix(vec3(1.), rgb, c.y);
}


 //generic rotation formula
vec2 rot(vec2 uv,float a){
	return vec2(uv.x*cos(a)-uv.y*sin(a),uv.y*cos(a)+uv.x*sin(a));
}


void main()
{
   vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
   p = rot(p,time*.01);	
  
  for(int i=1;i<complexity;i++)
  {
    vec2 newp=p;
    newp.x+=0.8/float(i)*sin(float(i)*p.y+time/fluid_speed*.3+1.5*float(i)*.55)+14.;
    newp.y+=0.8/float(i)*sin(float(i)*p.x+time/fluid_speed*.6+1.5*float(i)*.3)+14.;
    p = newp;
   
  }
	vec3 col = hsb2rgb(vec3( p.x*.1,.6,.9 ));	
	
	// make some highlights
	col -= sin(p.x*29.)*.1;
	
	gl_FragColor=vec4(col, 1.0);
}
