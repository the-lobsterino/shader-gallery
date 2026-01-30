#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = gl_FragCoord.xy;
	vec3 color = vec3(0.0);
	float angle = atan(pos.y-resolution.y/4.0, pos.x-resolution.x/1.0);
	

	color.r=sin(angle*10.0+time*1.0)*0.5+0.5;
	color.g=sin(angle*10.0+time*1.254)*0.5+0.5;
	color.b=sin(angle*10.0+time*1.416)*0.5+0.5;

	float px = length(vec2(mod(pos.x, 16.0)-8.0, mod(pos.y, 16.0)-8.0)) / length(vec2(8.0,8.0));
	color = ((color - px) * 10.0) + 0.5;
	//color.r = (color.r > px) ? 1.0 : 0.0;
	//color.g = (color.g > px) ? 1.0 : 0.0;
	//color.b = (color.b > px) ? 1.0 : 0.0;
			 
	gl_FragColor = vec4(color, 1.0 );

}