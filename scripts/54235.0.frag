#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//sampler2d

// https://github.com/hughsk/glsl-hsv2rgb/blob/master/index.glsl
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
float ss = 32.0*sin(time*0.3);
	vec2 gg = gl_FragCoord.xy;
	gg = ceil(gg / ss) * ss;	

	//vec2 position = ( gg / resolution.xy ) + mouse / 4.0;

	/*float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;*/
	//float color = length(position);
	float bins = 10.0;
	vec2 pos = (gg / resolution.xy);
	float bin = floor(pos.x * bins + 0.3*sin(3.0*time)*sin(time+pos.y*10.0));
	gl_FragColor = vec4( hsv2rgb(vec3(bin/bins, 0.5, 0.8)), 1.0 );

}