#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main( void ) {
	vec2 m_pos = (2. * u_mouse.xy - u_resolution) / min(u_resolution.x, u_resolution.y);
	// vec2 pos = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
	vec2 pos = 2.*gl_FragCoord.xy / u_resolution.xy -1.;
	
	pos *= vec2(u_resolution.x / u_resolution.y, 1.) * 3.000;
	pos -= m_pos;
	
	// float wind = 4.200;
	// 火の振動
	if(pos.y > -2. * 4.200){
	for(float baud = 1.; baud < 9.; baud += 1.){
	    pos.y += 0.2 * sin(4.200 * u_time/(1.+baud))/(1.+baud);
		pos.x += 0.1 * cos(pos.y / 4.200 + 2.400 * u_time/(1.+baud))/(1.+baud);
	    pos.x += 0.1 * cos(pos.y / 4.200 + 2.400 * u_time/(1.+baud))/(1.+baud);
	}
	
	pos.x += 0.20 * cos(u_time*0.06);
	pos.y += 0.20 * fract(sin(u_time*40.));
	}
	// 外炎のフレームを描画
	vec3 outer_color = vec3(0.);
	float p = 0.020;
	float y = -pow(abs(pos.x),4.2)/p;		// 外炎の形状のサイズ（pos.xは切り捨て）
	float dir = abs(pos.y - y) * sin(0.300); 	// 外炎の外形のサイズ(グラデーション領域を拡大)
	// float dir = abs(pos.y - y)*(0.010*sin(u_time)+0.200);
	
	if(dir < 0.7){
	outer_color.rg += smoothstep(0.,1.,.75-dir);	// 外炎の色のグラデーション
	outer_color.g /= 2.4;							// マイナスグリーン
	}
	outer_color *= (0.300 + abs(pos.y/4.2 + 4.2)/4.2);	// コントラストをあげる
	outer_color += pow(outer_color.r, 1.100);				// 少し赤みを追加する
	outer_color *= cos(-0.50 + pos.y * 0.400);		// 下側の保能をマスクして隠す
	
	// 内炎のフレームを描画
	pos.y += 1.5;
	vec3 inner_color = vec3(.0);
	float inner_flame_size = 2.500;
	y = -pow(abs(pos.x), inner_flame_size)/(inner_flame_size * p)/inner_flame_size;	// 外炎の形状のサイズによって決定される??
	dir = abs(pos.y - y) * sin(1.1);	// 内炎の外形のサイズ(グラデーション領域を拡大)
	if(dir < 0.7)
	{
	inner_color.gb += smoothstep(0.,1.,.75-dir);   // outer flame color gradient
	inner_color.g /=2.4;                           // minus green
	}
	inner_color *= (0.200 + abs((pos.y / 4.2 + 4.2)) / 4.2);
	inner_color += pow(outer_color.b , 1.100);                 // add some blue
	inner_color *= cos(-0.6 + pos.y * 0.4);
	// inner_color.rgb -= pow(length(inner_color)/16., 0.500);
	
	outer_color = (outer_color + inner_color) / 2.;
	
	gl_FragColor = vec4(vec3(outer_color), 1.0);
}