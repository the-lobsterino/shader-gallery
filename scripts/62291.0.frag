// Necip's transfer from https://www.youtube.com/watch?v=PBxuVlp7nuM
// with little modifications...

#define iTime	time
#define iResolution resolution



#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




// "ShaderToy Tutorial - CameraSystem" 
// by Martijn Steinrucken aka BigWings/CountFrolic - 2017
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
//
// This shader is part of my ongoing tutorial series on how to ShaderToy
// For an explanation go here: 
// https://www.youtube.com/watch?v=PBxuVlp7nuM

float DistLine(vec3 ro, vec3 rd, vec3 p) {
	return length(cross(p-ro, rd))/length(rd);
}

float DrawPoint(vec3 ro, vec3 rd, vec3 p) {
	float d = DistLine(ro, rd, p);
    d = smoothstep(.6, .0, d);
    return d;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = iTime;
    
    vec2 uv = fragCoord.xy / iResolution.xy; // 0 <> 1
    uv -= .5;
    uv.x *= iResolution.x/iResolution.y;
    
    vec3 ro = vec3(3.*sin(t), 2., -3.*cos(t));
    
    vec3 lookat = vec3(.5);
    
    float zoom = .5;
    
    vec3 f = normalize(lookat-ro);
    vec3 r = cross(vec3(0., 1., 0.), f);
    vec3 u = cross(f, r);
    
    vec3 c = ro + f*zoom;
    vec3 i = c + uv.x*r + uv.y*u;
    vec3 rd = i-ro;
    
   
    
    float d = 0.;
  
/*
    d += DrawPoint(ro, rd, vec3(0., 0., 0.));
    d += DrawPoint(ro, rd, vec3(0., 0., 1.));
    d += DrawPoint(ro, rd, vec3(0., 1., 0.));
    d += DrawPoint(ro, rd, vec3(0., 1., 1.));
    d += DrawPoint(ro, rd, vec3(1., 0., 0.));
    d += DrawPoint(ro, rd, vec3(1., 0., 1.));
    d += DrawPoint(ro, rd, vec3(1., 1., 0.));
    d += DrawPoint(ro, rd, vec3(1., 1., 1.));
    */
	
	float k = 0.;
	
	for (float x=0.0; x<=1.0; x+= 0.1) {
		for (float y=0.0; y<=1.0; y+= 0.1) {
			for (float z=0.0; z<=1.0; z+= 0.1) {
				k += 1.;
				d += DrawPoint(ro, rd, vec3(x, y, z));
			}
		}
	}
		
	fragColor = vec4(d / k);
}



void main( void ) {

	mainImage( gl_FragColor, gl_FragCoord.xy );
}
