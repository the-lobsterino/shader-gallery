// cunts

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
#define PI 3.14159


float lines(in vec2 pos, float b)
{
    pos.x *= 20.0;
    float l = 0.5+sin(pos.x*PI*2.0)*0.5;
    l = smoothstep(-0.5,1.0,l);
    return l;
    
}

vec3 hsb2rgb( in vec3 c )
{
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}



void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  vec2 st = fragCoord/iResolution.y;
  float zoom = sin(iTime)*0.2;
  zoom  = 0.5+zoom;
  vec2 pos = vec2 (st*zoom);
  //vec2 pos = vec2 (st*1.25);
  float l = lines(pos,.01);
  vec3 color = hsb2rgb(vec3(iTime*0.1 + fract(pos.x), .7, .9)) * l;
  fragColor = vec4(color, 1.0);

}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;	
}