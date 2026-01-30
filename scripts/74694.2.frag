#extension GL_OES_standard_derivatives : enable
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main( void ) {
	
	vec2 p = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y);
	
	
	vec3 white = vec3(1,1,1);
	vec3 red = vec3(1, 0, 0);
	vec3 green = vec3(0, 1, 0);
	vec3 blue = vec3(0, 0, 1);
	vec3 black = vec3(0, 0, 0);
	//float c = floor(0.5*0.5 - p.x * p.x) + (0.5*0.5 +p.y * p.y);
	//float c = floor((p.x *p.x) * 2.0 + (p.y *p.y) *2.0);
	float x = -1.5 * mouse.x + p.x*5.0;
	float y = -1.5 * mouse.y + p.y*5.0;
	float c = (x * x + y * y );
	vec3 cor =  vec3(c, c, c)  ;
    gl_FragColor = vec4(cor, 1);
}