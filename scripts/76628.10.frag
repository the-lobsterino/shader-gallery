#ifdef GL_ES
precision highp float; 
#endif
 
vec2 uv;

uniform float time;
uniform vec2 resolution;

mat2 rotate(float a)
{
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}
vec3 hsv2rgb_smooth( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	

	return c.z * mix( vec3(1.0), rgb, c.y);
}
void main( void ) 
{
	float tt = time*.21;
	vec2 aspect = resolution.xy / resolution.y;
	uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	float _d =  1.0-length(uv);
	_d*=.94;
	uv.x += smoothstep(0.7,1.1,uv.x*0.6);
	uv *= 3.0+sin(_d*2.45+uv.y+tt*0.14) ;

	
	vec3 ch_color = hsv2rgb_smooth(vec3(uv.x*0.14+tt*0.4165+uv.y*.41,0.4+(sin(tt+_d*_d)*0.1),0.9));

	vec2 uv2 = 0.1+uv*.43;
	uv2.x *= dot(uv2,uv);
	//uv *= rotate(time*0.1+uv.x*0.05+length(uv2)*0.013);
	uv2 *= rotate(sin(_d*3.3)+tt*0.3+uv.x*.404+length(uv)*0.04);
	
	float c1 = sin(uv.y*3.7-uv.x*4.0+length(uv)*1.4);
	vec3 bg_color = vec3(c1*0.9,c1,c1*0.8)*(0.7+sin(uv.x*2.2-uv.y*8.3+tt)*0.5);
	bg_color.gb += c1*0.1+(sin(uv2.x*2.2+length(uv))*0.3);
	
	uv.y += -0.4+sin(uv.y*.6+tt*0.47+uv.x*1.45)*0.5;
	uv *= rotate(tt*0.3+uv.y*1.35);
	
	uv += sin(uv.x*0.3+tt*0.2+length(uv))*0.3;
	
	bg_color /= mix (bg_color,bg_color*(1.5+sin(uv.x*3.3+uv.y*1.6)*.45),length(bg_color*(1.25+sin(uv.y+tt)))+sin(tt+uv.x*1.4));
	bg_color /= sin(ch_color*2.73);
	bg_color *= abs(cos(uv2.x+tt*0.35)+sin(c1*0.3+tt*1.3+length(uv)));
//	if (bg_color.r>0.15)
//		bg_color += bg_color*2.1;
	
	float vvv = smoothstep(0.9,1.0,bg_color.r);
	
	bg_color = mix(bg_color*.1,bg_color*2.1,vvv);
	
	
	vec3 color = bg_color*.21;
		
	gl_FragColor = vec4(color, 1.0);
}
