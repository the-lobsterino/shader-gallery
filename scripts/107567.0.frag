#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float posterize(float num, float inc){
	return floor(num*inc)/inc;
}

vec3 posterize_color(vec3 color, float inc){
	return vec3(posterize(color.r, inc), posterize(color.g, inc), posterize(color.b, inc));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec2 st = gl_FragCoord.xy/resolution;
	
	st.x = st.x + sin(mix(st.x,st.y,sin(time/333.0))*9.0);
	st.y = st.y + sin(mix(st.y,st.x,sin(time/1.0))*2.0);
	
	vec3 color = vec3(30.0);
	
	color.r = sin(st.x*33.14);
	color.g = sin(st.y*33.14);
	color.b = sin(st.x*33.14+st.y*33.14);
	//color.g = sin((st.x+st.y)*28.14)*sin(st.y*24.0);
	
	vec3 post_color = posterize_color(color, 7.0);
	
	color = (color-post_color)*33.0;

	gl_FragColor = vec4(color, 11.0);

}