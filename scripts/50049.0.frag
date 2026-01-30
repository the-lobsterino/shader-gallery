#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec4 color;
vec4 circle(vec2 uv,vec2 pos, float size, vec4 Ccolor){
if(pow(uv.x-pos.x,2.0) + pow(uv.y-pos.y,2.0) < size) return Ccolor;	
	else return color;
}
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);
	uv *= 17.0 * vec2(resolution.x / resolution.y, 1);
	color = vec4(1,1,1,1);
	color = circle(uv,vec2(2.0*sin(4.0*time),-2.0*sin(4.0*time)),1.0,vec4(1,0,0,1.0));
	color = circle(uv,vec2(-2.0*sin(4.0*time),2.0*sin(4.0*time)),1.0,vec4(1,1,0,1.0));
	color = circle(uv,vec2(-2.0*sin(4.0*time),-2.0*sin(4.0*time)),1.0,vec4(0,1,0,1.0));
	color = circle(uv,vec2(2.0*sin(4.0*time),2.0*sin(4.0*time)),1.0,vec4(0,0,1,1.0));
	gl_FragColor = color;

}