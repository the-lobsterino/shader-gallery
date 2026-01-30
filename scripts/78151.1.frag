/*

 > playing with colors again - 

*/

precision lowp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159
#define TWO_PI (PI * 2.0)
#define N 12.0



vec3 hsb2rgb(vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x * 6. + vec3(0. , 4., 2.), 6.) - 3.) - 1., 0., 1. );
    rgb = rgb * rgb * (3. - 2. * rgb);
    return c.z * mix(vec3(1.), rgb, c.y);
}



void main( void ) {

 
    vec2 uv =( gl_FragCoord.xy / resolution.xy )  ;

    
    
	
    float steppi = sin(uv.x*72.  )*.5+.5;
	
	steppi += abs(uv.y*20.  )*1.5+0.5;
	
    steppi *= abs(uv.y*0.2 + 0.5)*.5+.5;
     
	 
	
    
      float f = steppi;//smoothstep( .1, .9, steppi );
	
	
	float shift = mouse.x;
	
	float spread = sin(time)*0.5+0.5;
	
	f += shift*6.3;
	
	
	
	vec3 col = vec3(
	cos(f)*.5+.5,
	cos(f*spread )*.5+.5,
	cos(f*spread*2.)*.5+.5
	);
	
	col = hsb2rgb(col);
	
	
   	 gl_FragColor = vec4(vec3(col), 1.0);

}