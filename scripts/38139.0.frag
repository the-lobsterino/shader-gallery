#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// https://www.shadertoy.com/view/MdcGWS

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) 
{
    vec2 s = resolution.xy;
    vec2 g = gl_FragCoord.xy;
	
    // central uv
	vec2 uv = (2. * g - s)/s.y*2.;
    
    // time
    float t = time*0.5;
    
    // radius
    float r = (sin(t*5.)+.7);
    
    // paths
    vec2 d0 = vec2(cos(t), sin(t)) * r;
    vec2 d1 = vec2(cos(t+1.57), sin(t+1.57)) * r; // +90Â°
    
    // metaballs
    float m0 = 0.04/dot(uv-d0,uv-d0);
    float m1 = 0.02/dot(uv+d0,uv+d0);
    float m2 = 0.02/dot(uv-d1,uv-d1);
    float m3 = 0.02/dot(uv+d1,uv+d1);
    
    // current color
	vec4 col = vec4(vec3(m0+m1+m2+m3),1);
    
    // last color
    vec4 bufA = texture2D(backbuffer, g / s*0.995);
    
    // simple blending of new and last color
    vec4 f = col * 0.2 + bufA * 0.8;
    
    // add some colored aura to the metaballs
    f += smoothstep(bufA, bufA+0.01, vec4(.8,.2,.5,1))*0.01;
	
    gl_FragColor = f;
    gl_FragColor.a = 1.;
}