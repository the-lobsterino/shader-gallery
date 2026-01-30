// from Hud practice https://www.shadertoy.com/view/MsKSWw
// .. it's look like 8 bit machines demo now ! Gigatron !
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform sampler2D lastFrame;

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float spiralr(float a, float l){
    float f = smoothstep(.0, -.2, cos(a*15.0 + time*2.0))*.341;

 	float g = 1.0-smoothstep(0.0, 1.0, l*3.0);

    f = f-g;
    f = 1.0-smoothstep(f, f+0.008, l);
    return f;
}
float spirall(float a, float l){
    float f = smoothstep(.0, -.2, cos(a*15.0 - time*2.0))*.341;

 	float g = 1.0-smoothstep(0.0, 1.0, l*3.0);

    f = f-g;
    f = 1.0-smoothstep(f, f+0.008, l);
    return f;
}


void main()
{
    
	vec2 uv = surfacePosition*3.;
   // uv.x *= resolution.x/resolution.y;
    float a = atan(uv.y,uv.x);
    float l = length(uv)+0.2*sin(time*0.2) ;
   
    vec3 color = vec3(.0, 0., 0.);
    
   	vec3 blue = vec3(0.0,0.0,1.0);
    vec3 green = vec3(0.0,1.0,0.0);
    vec3 grey = vec3(0.0, 0.0, 0.0);
  
    
        
    color = mix(color, vec3(1. ,1., 1.), spirall(a, l/0.3));
    color = mix(color, vec3(1. ,1., 1.), spiralr(a, l/0.5));
    
        
      
    
    
    color = mix(color, vec3(1. ,.0, 0.), spirall(a, l/0.7));
    
    color = mix(color, vec3(0. ,1., 1.), spiralr(a, l/0.9));
    
    color = mix(color, vec3(1. ,0., 1.), spirall(a, l/1.1));
    color = mix(color, vec3(1. ,1., 1.), spiralr(a, l/1.4));
    
    color = mix(color, vec3(1. ,1., 0.), spirall(a, l/1.8));
    color = mix(color, vec3(1. ,1., 1.), spiralr(a, l/2.2));
    
    color = mix(color, vec3(0. ,1.,0.), spirall(a, l/2.8));
    color = mix(color, vec3(0. ,0., 1.), spiralr(a, l/3.6));
    
	gl_FragColor = vec4(color/mod(2.0*(gl_FragCoord.y+gl_FragCoord.x/2.), 6.),1.0);
	
	#define T2(X,Y) texture2D(lastFrame, fract((gl_FragCoord.xy+vec2(X,Y)-2.*surfacePosition)/resolution))
	gl_FragColor = max(gl_FragColor, (vec4(0)
		+T2(-1,-1)	+T2(-1,0)	+T2(-1,1)
		+T2(0,-1)	-T2(0,0)		+T2(0,1)
		+T2(1,-1)	+T2(1,0)		+T2(1,1)
		)/7. - 3./(256.));
	 
}