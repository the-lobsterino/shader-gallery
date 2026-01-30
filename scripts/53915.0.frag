#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 col1 = vec4(1.0, 0.4, 0.0, 1.0);

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) ;
	
	vec4 color = col1;
	
	
	color.xy *= fract(uv*4.0) +0.4 ;
	

	float circleR = 0.3;
	vec2 normalizedUv = uv;
	normalizedUv.x *= resolution.x/resolution.y;
	float circle = distance(vec2(0.5), normalizedUv);
	
	if(circle > 0.5){
		color = vec4(1.0);
	}
	if(normalizedUv.x>1.0){
		color = vec4(0.3, 0.0, 0.5, 1.0);
	}
	
	//color *= 1.-circle;
	
	color.x = fract((uv.x+time/10.0) * 10.0);
	color.y = fract(uv.y+ time/10.0);
	
	color *= step(uv.x, 0.5) + 0.5;
	
	uv.x = abs(uv.x-0.5);
	color.x += fract(uv.y+time);
	color += 0.2;
	

	gl_FragColor = color;


}