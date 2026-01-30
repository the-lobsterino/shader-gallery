#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;


vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 hsv2(float hue, float sat, float val){
	
return hsv2rgb(vec3(hue,sat,val));
		    
		  
	       
}

void main( void ) 
{
	vec4 buffer		= texture2D(renderbuffer, gl_FragCoord.xy/resolution+vec2(.55/resolution.x, 0.));	
	gl_FragColor.rgb 	= mix(hsv2rgb(vec3(sin(cos(gl_FragCoord.y*mouse.y)+gl_FragCoord.x + time) * 30.0,3.0,7.0)), buffer.xyz, .95);
	
}