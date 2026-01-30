#ifdef GL_ES
precision mediump float;
#endif
#define M_PI 3.14159265358979323846

uniform vec3 color;
uniform sampler2D texture;
varying vec3 vColor;
varying float vDiscard;
varying float vAlpha;
void main() {
  vec2 diff = (gl_PointCoord - vec2(0.5));
  vec2 diff2 = diff * diff;
  if( diff2.x + diff2.y > 1.0 ){discard;}
  vec4 Ct = texture2D(texture, gl_PointCoord);
  vec4 Cp = vec4(vColor * color, vAlpha);
  vec3 c = Cp.rgb * Ct.rgb ;
  gl_FragColor = vec4(c, vAlpha);
  if (gl_FragColor.a < 0.05 || vDiscard != 0.0){discard;}
}