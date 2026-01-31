/*

Trying to do the challenge on book of shader: 


	- Compose a gradient that resembles a William Turner sunset.
	- Animate a transition between a sunrise and sunset using u_time.


P.S: Although composition its not totally same as image i tried my best :P. 

https://thebookofshaders.com/06/


@author: abbas-dhd
github: https://github.com/abbas-dhd

*/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966

uniform vec2 resolution;
uniform float time;


vec3 sunriseSky = vec3(0.199,0.875,1.000);
vec3 sunriseSun = vec3(1.000,0.949,0.090);
vec3 sunriseLand = vec3(0.815,0.573,0.268);

vec3 sunsetSky = vec3(0.001,0.312,1.000);
vec3 sunsetSun = vec3(0.795,0.621,0.232);
vec3 sunsetLand = vec3(0.540,0.380,0.178);
    

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    
    // --- sunset
    vec3 sunrise = mix(sunriseSky,sunriseSun, smoothstep(1., sin(time) * .5,st.y) - 
                       ( 
                           smoothstep(0.6,1.0,st.x) + smoothstep(0.55,0.000,st.x) 
                       )
                      );
    sunrise  = mix(sunrise, sunriseLand, smoothstep(0.5,0.09,st.y));
    
    // --- sunset
    
    vec3 sunset = mix(sunsetSky,sunsetSun, smoothstep(1., cos(time) * -.5 ,st.y) - 
                       ( 
                           smoothstep(0.6,1.0,st.x) + smoothstep(0.55,0.000,st.x) 
                       ) 
                      );
    sunset  = mix(sunset, sunsetLand, smoothstep(0.5,0.09,st.y));
    
    
    vec3 color = mix(sunset,sunrise, sin(time));
	

		
    
    gl_FragColor = vec4(color,1.0);
}
