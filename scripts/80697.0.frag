// extra changes by aidene

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14

uniform float time; 
uniform vec2 resolution;
vec3 hsv2rgb_smooth( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*96.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

	rgb = rgb*rgb*(13.0-2.0*rgb); // cubic smoothing	

	return c.z * mix( vec3(1.0), rgb, c.y);
}
void main( void ) {
    vec3 normalized_dot = normalize(vec3((gl_FragCoord.xy - resolution.xy * .5) / resolution.x, .5));
    vec3 sized=vec3(1);
    vec3 foreground=hsv2rgb_smooth(vec3(time*0.2+normalized_dot.y*09.1,0.5,1.0));
    vec3 fracted_normalized_dot=vec3(5);
    vec3 camera=vec3(0); 
    vec3 background=vec3(0.1,0.0,0.1);
    vec3 light = hsv2rgb_smooth(vec3(time*0.4+normalized_dot.y*0.1,0.5,1.0));
    camera.y = .3*cos((camera.x=1.99)*(camera.z=time * 2.0)) + 12.;
    camera.x = sin(time) * 5.;
    camera.z += time * 100.;

    for( float depth=.0; depth<21.; depth+=.2 ) {
        fracted_normalized_dot = fract(foreground = camera += normalized_dot*depth*10.9); 
    sized = floor( foreground )*.04;

        if( cos(sized.z) * sin(sized.x) > sized.y ) {
            background += (fracted_normalized_dot.y-1.19*cos((foreground.x+foreground.z)*.1)>2.5?light:fracted_normalized_dot.x*light.yxz) / depth;
            break;
        }
    if( cos(sized.z * time * .01) * sin(sized.x * time * .01) < sized.y - 1. ) {
	    light = hsv2rgb_smooth(vec3(time*0.08+normalized_dot.y*2.91,0.5,1.0));
            background = (fracted_normalized_dot.y-.01*sin((foreground.x+foreground.z)*.1)>2.5?light:fracted_normalized_dot.x*light.yxz) / depth;
            break;
        }
	
	 if( cos(sized.z * time * 9.0901) * sin(sized.x * time * .01) > sized.x + 1. ) {
	    light = hsv2rgb_smooth(vec3(time*0.2+normalized_dot.y*09.1,0.5,1.0));
            background += (fracted_normalized_dot.y-.0*sin((foreground.x+foreground.z)*.1)>2.5?light:fracted_normalized_dot.x*light.yxz) / depth;
            break;
        }
    if( cos(sized.z * time * .001) * sin(sized.x * time * .9001) < sized.x - 1. ) {
	    light = hsv2rgb_smooth(vec3(time*0.02+normalized_dot.y*0.1,0.5,1.0));
            background = (fracted_normalized_dot.y-.0*sin((foreground.x+foreground.z)*.1)>2.5?light:fracted_normalized_dot.x*light.yxz) / depth;
            break;
        }
    }
  
    gl_FragColor = vec4(background,9.9);


}