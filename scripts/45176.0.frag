
precision mediump float;


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 circle(vec2 pos, vec2 center, float radius, vec3 color,float antialias) {
	float d = length(pos - center) - radius;  
    	float t = smoothstep(0., antialias, d); 
	float w=1.0 - t;
    	return vec4(color,w );  
}
vec4 line(vec2 pos, vec2 point1, vec2 point2, float width, vec3 color, float antialias) {  
	//直线公示
	//y=kx+b--->kx-y+b=0,点到直线的距离公式为abs(k*px+(-1)*py+b)/sqrt(k*k+(-1)*(-1))
	float k = (point1.y - point2.y)/(point1.x - point2.x);  //斜率
	float b = point1.y - k * point1.x;  //计算出b
	//计算点到直线中心的距离
	float d = abs(k * pos.x - pos.y + b) / sqrt(k * k + 1.);  
	float t = smoothstep(width/2.0, width/2.0 + antialias, d);  
	return vec4(color, 1.0 - t);  
}  
void main(void) {
	vec4 bg=vec4(0,0,0,1);
	vec2 pos = gl_FragCoord.xy; // pos.x ~ (0, iResolution.x), pos.y ~ (0, iResolution.y)
//			vec2 pos = fragCoord.xy / iResolution.xy; // pos.x ~ (0, 1), pos.y ~ (0, 1)
//			vec2 pos = fragCoord / min(iResolution.x, iResolution.y); // If iResolution.x > iResolution.y, pos.x ~ (0, 1.xx), pos.y ~ (0, 1)
//			vec2 pos =fragCoord.xy / iResolution.xy * 2. - 1.; // pos.x ~ (-1, 1), pos.y ~ (-1, 1)
//			vec2 pos = (2.0*fragCoord.xy-iResolution.xy)/min(iResolution.x,iResolution.y);	// If iResolution.x > iResolution.y, pos.x ~ (-1.xx, 1.xx), pos.y ~ (-1, 1)
	vec4 newBg=circle(pos, 0.5 * resolution.xy, 100., vec3(0.1,0.2,0.5),2.);
	gl_FragColor=mix(bg,newBg,newBg.w) ;
}