/*
 * Original shader from: https://www.shadertoy.com/view/NsBXDm
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
 vec2 uv = fragCoord/iResolution.xy*10.;
 
 for (float i = 1.; i <= 100.; i++)
  {
    vec2 uv2 = uv;
    uv2.x += sin(iTime*.25)*1.25/ i* sin(i *  uv2.y + iTime * 0.55);
    uv2.y +=  cos(iTime*.2)*2./i* cos(i * uv2.x + iTime * 0.35 ); 
    uv = uv2;
  }
  
 float r = abs(sin(uv.x))+.5;
 float g =abs(sin(uv.x+2.))-.2;
 float b = abs(sin(uv.x+4.));   
 vec3 col = vec3(r,g,b);   
 
 fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}