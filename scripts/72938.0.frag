/*
 * Original shader from: https://www.shadertoy.com/view/fsjSzV
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
// from https://www.shadertoy.com/view/Mls3R7
void rotate(inout vec2 p,float angle,vec2 rotationOrigin)
{
    p -= rotationOrigin;
    p *= mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
    p += rotationOrigin;
}


float stripe(float x, float stripeWidth) {
  float s = mod(x + 0.5 * stripeWidth, 2.0 * stripeWidth);
  if (s > stripeWidth) {
    s = 2.0 * stripeWidth - s;
  }
  return smoothstep(stripeWidth * 0.5, stripeWidth * 0.5 - 0.001, s);
}

float xorBW(float color1, float color2) { 
  return abs(color1 - color2);
}

float checkerboardColor(vec2 uv, float squareSize) {
  return xorBW(stripe(uv.x, squareSize), stripe(uv.y, squareSize));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    uv -= 0.5;
    uv.x *= iResolution.x / iResolution.y;

    float squareSize = 0.2;
    
    float squareSize1 = squareSize * (1.0 + 0.3 * cos(1.0 * iTime));
    vec2 uv1 = uv + squareSize1 * vec2(-0.125);
    rotate(uv1, -0.5 * iTime, vec2(0.5 * squareSize1));

    float squareSize2 = squareSize * (1.0 + 0.2 * cos(2.0 * iTime));
    vec2 uv2 = uv + squareSize2 * vec2(0.625);
    rotate(uv2, 0.25 * iTime, vec2(0.5 * squareSize2));

    float c1 = checkerboardColor(uv1, squareSize1);
    float c2 = checkerboardColor(uv2, squareSize2);

    fragColor = vec4(vec3(xorBW(c1, c2)), 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}