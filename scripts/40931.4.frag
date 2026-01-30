// AMIGA DECRUNCHER EXAMPLE ;
// Gigatron France ;
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (vec2 uv) { 		
    return fract(sin(dot(uv.xy,vec2(12.9898,78.233)))*43758.5453123);
}

void main()
{
    vec2 uv = gl_FragCoord.xy/resolution.xy; 		

    uv.y *= 20.0*mod(floor(1.*time),8.0); 		
    											 
    float t = time*0.005;
    vec2 p = floor(uv);   
 
   /* vec3 color = vec3(random( vec2(p.x,p.y)), random( vec2(p.x,p.y) + t),
                      0.1+random( vec2(p.x, p.y) - t )); */
	// bytekiller 
    vec3 color = vec3(0., random( vec2(p.x,p.y) + t),
                      0.1+random( vec2(p.x, p.y) -t )); 
	

    gl_FragColor = vec4(color,1.0)-0.2;
}
