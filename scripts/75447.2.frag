#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(){
	vec2 pos = ( gl_FragCoord.xy / resolution.xy )*8.-vec2(4.,4.);
	if (pos.y>-6.) {
		pos.y += 0.2*fract(sin(time*400.));
	}
	
	vec3 color = vec3(0.,0.,0.0);
	float p =.004;
	float y = pow(abs(pos.x),3.2)/(2.*p)*3.3;
	float dir = length(pos+vec2(pos.x,y))*sin(0.26);
	if (dir < 0.7) {
		color.rg += smoothstep(0.0,1.,.75-dir);
		color.g /=2.4;
	}
	
	color += pow(color.r,1.1);
	
	// blue flame
	float p1 = .015;
        float y1 = pow(abs(pos.x),3.2)/(2.*p1)*3.3;
        float d = length(pos+vec2(pos.x,y1+2.3))*sin(0.28);
        color.b += smoothstep(-0.2,.9,0.47-d);
        color.g += smoothstep(-0.3,.9,0.17-d);
	
	gl_FragColor = vec4(color,1.0);
}
