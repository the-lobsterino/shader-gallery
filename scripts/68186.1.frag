// Original ShaderToy: https://www.shadertoy.com/view/WdcyWf

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution


// --------[ Original ShaderToy begins here ]---------- //
// Attract & Repel shader overlay
// https://www.shadertoy.com/view/WdcyWf
// added whiteout / pixelate
float Lines(float x,float dir)
{
    x*=1.5;		// scale
    x = abs(x);
    float r = pow(x,3.0);
    
    float t = fract(iTime*dir)*6.28;
    
	float v = 1.0 + .5*sin((r+t)/0.1);
	v=v*smoothstep(-0.8,1.0,1.0-x);
    v*=v;
    return v;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (iResolution.xy - 2.0*fragCoord.xy)/iResolution.y; 
    float t = iTime;

    float dval = iResolution.y/0.5;
    float v1 = 1.0+ sin(uv.x*dval)*0.125;
    float v2 = 1.0+ cos(uv.y*dval)*0.125;
    
    uv += (sin(t*1.5+uv*16.0)*0.025).yx;   	// +=wibble
//    if (iMouse.z>0.5)
//        uv = vec2(dot(uv,uv));
    
    // Change X,Y,Direction,Colour every 4 seconds
    float mcount = t - mod(t,4.0);
    float cmult1 = step(8.0, mod(mcount,16.0));
    float cmult2 = step(4.0, mod(mcount,8.0));
    float speed = mix(0.1,-0.1,cmult1);
    vec3 col = mix(vec3(0.4,0.5,0.9)*1.2, vec3(0.9,0.3,0.3)*1.4, cmult1);
    float v = mix(uv.x,uv.y,cmult2);
    float c = Lines(v,speed);
    
    c*=v1*v2;	// dotty

    
	fragColor = vec4(col*c,1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}