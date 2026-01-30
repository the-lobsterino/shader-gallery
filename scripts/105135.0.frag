#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main( void ) {

	vec2 st = gl_FragCoord.xy/resolution;
	
	st.x = st.x - st.y - time;
	
	st.x = st.x + (sin(st.y+st.y+time)-0.5)*(mouse.y*5.0);
	
	float noise_mult = (mouse.x+7.5)*5.0; 
	
	vec3 rgb = vec3(sin((st.x+(random(st)-0.5)/noise_mult)*3.14),sin((st.x+(random(st+vec2(0.3))-0.5)/noise_mult)*3.14+0.6),sin((st.x+(random(st+vec2(0.8))-0.5)/noise_mult)*3.14+1.2));
	


	gl_FragColor = vec4(rgb,1.0);

}