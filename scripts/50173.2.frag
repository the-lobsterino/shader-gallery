// rectangle shader
// http://glslsandbox.com/e#43268.6

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

// ref.: https://www.shadertoy.com/view/MssyRN

//---------------------------------------------------------
// draw rounded rectangle
//---------------------------------------------------------

float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
	size.x += 0.101;
	size.y += 0.101;
  if(sqrt(pow(max(abs(uv.x-pos.x)-size.x+radius-thickness,0.0),2.0) + pow(max(abs(uv.y-pos.y)-size.y+radius-thickness,0.0),2.0)) - radius < 0.0) return 1.0;
	else return 0.0;
}

//---------------------------------------------------------
// draw rectangle frame with rounded edges
//---------------------------------------------------------

float roundedFrame (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
	size.x += 0.113;
	size.y += 0.113;
	thickness += 0.016;
  if((sqrt(pow(max(abs(uv.x-pos.x)-size.x+thickness+radius,0.0),2.0) + pow(max(abs(uv.y-pos.y)-size.y+thickness+radius,0.0),2.0)) - radius)*(sqrt(pow(max(abs(uv.x-pos.x)-size.x+radius,0.0),2.0) + pow(max(abs(uv.y-pos.y)-size.y+radius,0.0),2.0)) - radius) < 0.0) return 1.0;
	else return 0.0;
}
//---------------------------------------------------------
void main() {
  vec2 npos = gl_FragCoord.xy / resolution.xy;   // 0.0 .. 1.0
  float aspect = resolution.x / resolution.y;    // aspect ratio x/y
  vec2 ratio = vec2(aspect, 1.0);                // aspect ratio (x/y,1)
  vec2 uv = (2.0 * npos - 1.0) * ratio;          // -1.0 .. 1.0

  vec3 col = vec3(1.0);
  vec2 pos = vec2(0.0, 0.0);
  vec2 size = vec2(0.8, 0.2);
  float radius = 0.1;
  float thickness = 0.012;

  //--- rounded rectangle ---
  const vec3 rectColor = vec3(0.1, 0.3, 0.0);
  float intensity = roundedRectangle (uv, pos, size, radius, thickness);
  col = mix(col, rectColor, intensity);
	

  //--- rounded frame ---
  const vec3 frameColor = vec3(0.0, 0.8, 0.5);
  intensity = roundedFrame (uv, pos, size, radius, thickness);
  col = mix(col, frameColor, intensity);

  gl_FragColor = vec4 (col, 1.0);
}

