#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D tex;

void main(void) {
	vec2 pos = gl_FragCoord.xy/resolution.xy;
	vec2 uv = pos;
	uv.x += sin(uv.y * 15.0 + time) * 0.0001;
	uv.y += sin(uv.x * 15.0 + time) * 0.0001;
	uv.x += (fract(sin(uv.x*345.3 + uv.y*423.3 + time*426.4) * 345.3)- 0.5) / resolution.x;
	uv.y += (fract(sin(uv.x*234.8 + uv.y*264.8 + time*521.3) * 634.7)- 0.5) / resolution.y;
	
	vec4 col = texture2D(tex,uv);
	if (col.a < 0.5) {col = vec4(0.5);}
	
	gl_FragColor = vec4(col.rgb ,2
			 );
	
	vec2 mp = mouse - pos;
	mp.x *= resolution.x / resolution.y;
	float lmp = length(mp) / 0.05;
	if (lmp < 1.0) {
		gl_FragColor.rgb += vec3(sin(time*1.25432), cos(time*1.1543), sin(time*1.3153235)) * (1.0-lmp) * 0.1;
	}
}