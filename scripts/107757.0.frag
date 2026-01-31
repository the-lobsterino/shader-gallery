#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



void main()
{
    // Normalized pixel coordinates (from 0 to 1) with a square aspect ratio and centered
    vec2 XY = (gl_FragCoord.xy/iResolution.yy) + vec2(.5);
	vec2 uv = (gl_FragCoord.xy/iResolution.xy);
   
		XY.x -= .387;
    
    // zoom out a bit
    XY *= 5.0;
    
    // give the screen a wavy effect
    XY.x += sin(XY.y+iTime*5.0)/3.14159;
    
    // this stores the precedence of leach layer. Higher have higher numbers.
    vec4 order = vec4( 1.0, .75, .50, .25);
    
    // grid distortions for each layer. each can be anything. I wish I could store
    //     them in a single, scalable data structure
    vec2 XY1 = XY + vec2(cos(iTime), sin(iTime))*(1.0+order.x);
    vec2 XY2 = XY + vec2(cos(iTime), sin(iTime))*(1.0+order.y);
    vec2 XY3 = XY + vec2(cos(iTime), sin(iTime))*(1.0+order.z);
    vec2 XY4 = XY + vec2(cos(iTime), sin(iTime))*(1.0+order.w);
    
    // vector storing layers. would like to find a checkerboard-drawing routine that
    //     doesn't have as much redundancy.
    vec4 layers = vec4(mod(floor(XY1.x) + floor(XY1.y), 2.0)*order.x,
                       mod(floor(XY2.x) + floor(XY2.y), 2.0)*order.y,
                       mod(floor(XY3.x) + floor(XY3.y), 2.0)*order.z,
                       mod(floor(XY4.x) + floor(XY4.y), 2.0)*order.w);
	
     
	 
    
    // set the shade to the maximun precendence layer on the pixel
    float shade = max(max(layers.x, layers.y), max(layers.z, layers.w));
	
	 
    // give a little color
    vec3 shadea = hsv2rgb(vec3(uv.x,uv.y,uv.x*uv.y));
    vec3 shadeb = hsv2rgb(vec3(uv.y+uv.x,uv.y+uv.x,uv.y*uv.y)+sin(time));
    
	vec3 finshade = mix( shadeb, shadea,shade*2.0);
	
	 
    
    // Output to screen
    gl_FragColor = vec4(finshade,1.0);
}