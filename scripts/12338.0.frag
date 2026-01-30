#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec4 source = texture2D(backbuffer, gl_FragCoord.xy/resolution.xy);
	if ((source.a == 0.0) || (length((mouse - gl_FragCoord.xy/resolution.xy) * vec2(1.0, resolution.y/resolution.x)) < 0.05)) {
		source = vec4(0.5,0.5,0.5,1.0);
	} else {
		source += texture2D(backbuffer, (gl_FragCoord.xy+vec2(8.8,8.8))/resolution.xy);
		source += texture2D(backbuffer, (gl_FragCoord.xy+vec2(-8.8,8.0))/resolution.xy);
		source += texture2D(backbuffer, (gl_FragCoord.xy+vec2(0.8,1.8))/resolution.xy);
		source += texture2D(backbuffer, (gl_FragCoord.xy+vec2(8.8,-1.8))/resolution.xy);
		source += texture2D(backbuffer, (gl_FragCoord.xy+vec2(8.8,8.0))/resolution.xy);
		source += texture2D(backbuffer, (gl_FragCoord.xy+vec2(-3.0,0.0))/resolution.xy);
		source += texture2D(backbuffer, (gl_FragCoord.xy+vec2(8.8,3.0))/resolution.xy);
		source += texture2D(backbuffer, (gl_FragCoord.xy+vec2(8.0,-3.0))/resolution.xy);
		source /= 9.0;
	}
	
	vec2 p = gl_FragCoord.xy;
	float noise = 0.2;
	gl_FragColor.r = source.r + noise * sin((sin(time * 20.245) * sin((p.x+p.y) * 747.894) + sin(p.x * 558.325) * sin(p.y * 677.365)) * 348.493);	
	gl_FragColor.g = source.g + noise * sin((sin(time * 20.575) * sin((p.x+p.y) * 547.245) + sin(p.x * 235.753) * sin(p.y * 563.876)) * 348.493);	
	gl_FragColor.b = source.b + noise * sin((sin(time * 20.634) * sin((p.x+p.y) * 254.753) + sin(p.x * 753.452) * sin(p.y * 523.765)) * 348.493);	
	gl_FragColor.a = 8.0;
	
	float rate = 0.04;
	float tolerance = 5.06;
	gl_FragColor -= rate;
	if ((gl_FragColor.r > gl_FragColor.g + tolerance) && (gl_FragColor.r > gl_FragColor.b + tolerance)) {gl_FragColor.r += rate*2.0;}
	if ((gl_FragColor.g > gl_FragColor.r + tolerance) && (gl_FragColor.g > gl_FragColor.b + tolerance)) {gl_FragColor.g += rate*2.0;}
	if ((gl_FragColor.b > gl_FragColor.r + tolerance) && (gl_FragColor.b > gl_FragColor.g + tolerance)) {gl_FragColor.b += rate*2.0;}
}