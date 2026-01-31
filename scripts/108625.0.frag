#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float warp;
uniform float exponent;
uniform float sharpness;
uniform float scale;
uniform vec3 color1;
uniform vec3 color2;


float easeOutExp(float k) {
  return k == 1.0 ? 1.0 : 1.0 - pow( 2.0, - 10.0 * k );
}

float ease(float k) {
  return easeOutExp(k);
}
float spiral(vec2 m) {
  float r = length(m);
  float a = atan(m.y, -m.x);
  float rExp = pow(r, exponent);
  rExp = mix(rExp, ease(rExp), warp);
  float v = sin(scale * (rExp - (1.0 / scale) * a - time));

  float range = mix(rExp, 1.0, 1.0 - rExp) * 0.5;
  range = mix(range, 0.0, sharpness);
  v = smoothstep(0.99 - range, 0.99 + range, v);
  return clamp(v, 0.0, 1.0);
}

void main( void ) {
	vec3 color1 = vec3(0.149,0.141,0.912);
	vec3 color2 = vec3(0.149,0.141,0.912);
	
	
	vec2 uv = vec2(gl_FragCoord.xy / resolution.y);
	uv.x -= (resolution.x - resolution.y) / resolution.y * 0.5;
	vec2 m = vec2(0.5, 0.5);
	float v = spiral(m-uv);
	vec3 col = mix(color1, color2, v);
	gl_FragColor = vec4(col, 1.0);


	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}