/*
 * Original shader from: https://www.shadertoy.com/view/lls3WN
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
vec3 iResolution = vec3(0.0);

// --------[ Original ShaderToy begins here ]---------- //
void mainImage( out vec4 f, in vec2 w )
{
   float a=iTime,t=0.,b=cos(a),c=sin(a);

   for(int i=0;i<200;i++)
   {
      vec3 p=vec3(w,1.)/iResolution*t-1.;
       p.xz*=mat2(b,c,-c,b);
       for(int j=0;j<20;j++)
          p=reflect(p,p.yxz)+p*.1, p.y=-p.y;
       a=t;
       t+=min(length(p)-1.,1.)*.005;
   }

   f=vec4(2,3,4,1)/6./t+abs(a-t)*30.;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iResolution = vec3(resolution, 1.0);
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}