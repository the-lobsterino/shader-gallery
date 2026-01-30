// interleaved dithering function
// http://radiumsoftware.tumblr.com/post/112856931584
// by nikq.

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

float blurSize = 4.0/resolution.x;

float dither( vec2 sv_position, float scale ){
  vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return - scale + 2.0 * scale * fract( magic.z * fract( dot( sv_position, magic.xy ) ) );
}

float gradient( vec2 uv, float theta, float scale ){
	vec2 uvr = vec2(
		uv.x * cos(theta) + uv.y * sin(theta),
		uv.x * sin(theta) - uv.y * cos(theta));
	return uvr.x;
}

void main( void ) {

	vec3 color = vec3(0.0);
	vec2 uv = (gl_FragCoord.xy / resolution.xy);
	float base = gradient( uv-0.5, mouse.y * 3.141, 1.0 );
	float di   = dither( gl_FragCoord.xy, mouse.x );
	if( base > di )
		color = vec3(1.0);
	else
		color = vec3(0.0);
	color += texture2D(backBuffer, vec2(uv.x-blurSize,uv.y)).rgb;
	color += texture2D(backBuffer, vec2(uv.x+blurSize,uv.y)).rgb;
	color += texture2D(backBuffer, vec2(uv.x,uv.y-blurSize)).rgb;
	color += texture2D(backBuffer, vec2(uv.x,uv.y+blurSize)).rgb;
	color += texture2D(backBuffer, vec2(uv.x-blurSize,uv.y-blurSize)).rgb;
	color += texture2D(backBuffer, vec2(uv.x+blurSize,uv.y+blurSize)).rgb;
	color += texture2D(backBuffer, vec2(uv.x+blurSize,uv.y-blurSize)).rgb;
	color += texture2D(backBuffer, vec2(uv.x-blurSize,uv.y+blurSize)).rgb;
	color *= 0.111;
	gl_FragColor = vec4(color, 1.0);
}