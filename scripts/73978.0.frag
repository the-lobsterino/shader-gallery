/*
 * Original shader from: https://www.shadertoy.com/view/sllXDj
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
#define NUM 8 
        
  float rand(vec2 co){ 
    return fract(sin(dot(co.xy, vec2(12.9891,78.233))) * 43754.6453);
  }

  float ting(float i, vec2 uv, vec2 loc){
    return smoothstep(0.1, 0.7 + i / 20.0, 1. - atan(distance(uv, loc + vec2(0.2, 0.0))) * 3.);
  }

  void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord.xy / iResolution.xy;

    uv.y /= iResolution.x / iResolution.y;

    uv.y -= max(0.0,(iResolution.y - iResolution.x) / iResolution.y);

    float cl = 0.0;
    float dl = 0.0;
    float v = 2. - smoothstep(0.0, 1.0, 1.0 - (distance(uv, vec2(0.5, 0.5)))) * 2.;

    float t = cos(iTime);

    for (int i = 0; i < NUM; i++){
      float fi = float(i);
      float ty = rand(vec2(fi, 0.9));
      float tx = 0.1 * fi - 0.1 + 0.03 * cos(iTime + fi);
      float tcos = cos(iTime * float(i - NUM / 2) * 0.3);
      float tin = ting(fi * 1.2 * tcos, uv, vec2(tx, ty));

      if (tin > cl) {
        cl += smoothstep(cl, 1.2, tin);
      }

      tin = ting(fi * 1.1 * tcos, uv, vec2(tx + 0.01, ty + 0.01));

      if (tin > dl) {
        dl += smoothstep(dl, 1.1, tin);
      }
    }


    cl = sin(acos(cl - 0.2));
    dl = sin(acos(dl - 0.2));

    float j = sin(5.0 * smoothstep(0.3, 1.2, dl));

    cl = max(cl , j * 1.2);
    cl += rand(fragCoord.xy + iTime) * 0.14;
    cl -= v * 0.6;

    fragColor = vec4(cl * 1.44, (cl + dl) / 2.3, cl * 0.9, 1.0);
  }
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}