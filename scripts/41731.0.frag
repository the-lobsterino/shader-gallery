#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D mask;
uniform float alpha;

void main(void)
{
  vec4 original = texture2D(uSampler, vTextureCoord);
  float threshold = texture2D(mask, vFilterCoord).r;

  float mask = smoothstep(1.0 - alpha * 1.4, 1.0 - alpha * 1.4 + 0.4, threshold);

  float intensity = pow(min(1.0, alpha * 5.0), 5.0);

  gl_FragColor = vec4(original*mask*intensity);
}