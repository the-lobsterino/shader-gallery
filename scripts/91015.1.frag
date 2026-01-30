//SPEEDHEAD OF BYTERAPERS
//SPATIOSA 10

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}


uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
float snow(vec2 uv,float scale)
{

	
    float w = smoothstep(1.,0., -uv.y *(scale / 100.));
    
     
    uv += time / scale / 02.34;
    uv.y += time * 0.005/ scale;
    uv.x += sin (uv.y + time*.5) / scale;
    uv *= scale / 2.;
    vec2 s = floor(uv), f = fract(uv), p;
    float k = 3., d;
    p = 0.1 + .25 * sin(11.*fract(sin((s+p+scale) * mat2(7,3,6,5))*5.)) - f;
    d = length(p);
    k = min(d,k);
    k = smoothstep(0., k, sin(f.x+f.y) * 0.01);
        return k*w;
}

void main(void) {
  
    vec2 uv = (gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
    vec3 finalColor=vec3(0);
    float c = (0.5);
    c+=snow(uv,7.90)*.3;
    c+=snow(-uv,12.)*.5;
    c+=snow(-uv,15.)*.8;
    c+=snow((uv),10.);
    finalColor=(vec3(0.526,0.5,0.7996));
	
	vec2 position = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy;
 
	float a = 0.5 + cos(uv.y * 3.515926 * 2.0) * 0.5;
	float b = 0.55 + cos(uv.y * 3.1415926 * 2.0) * 0.5;
 
	vec3 color = mix(vec3(1.0, 0.48, 0.9), vec3(0.1, 0.1, 0.2), pow(a, 0.42)) * 3.;
	color += mix(vec3(0.8, 1.9, 1.0), vec3(0.1, 0.1, 0.2),  pow(b, 0.22)) * 0.75;
	color += mix(vec3(0.9, 0.8, 5.0), vec3(0.1, 0.2, 0.2),  pow(b, 0.21)) * 0.75;

	
    gl_FragColor = 0.9*vec4(c*color*finalColor,0.95);
}