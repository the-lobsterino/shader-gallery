#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec3 px_rgb(int dx, int dy)
{
	vec2 pos = vec2(gl_FragCoord.x - float(dx), gl_FragCoord.y - float(dy));
	if (pos.x < 0.0) {pos.x = resolution.x-1.0;;}
	if (pos.y < 0.0) {pos.y = resolution.y-1.0;}
	if (pos.x >= resolution.x) {pos.x = 0.0;}
	if (pos.y >= resolution.y) {pos.y = 0.0;}
	return texture2D(backbuffer, pos / resolution).rgb;
}

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

#define bpx(x,y,w) blur = blur + (px_rgb(x,y) * (w));
#define row(y,wl2,wl1,wm,wr1,wr2) bpx(-2,y,wl2) bpx(-1,y,wl1) bpx( 0,y,wm) bpx( 1,y,wr1) bpx( 2,y,wr2)

void main(void)
{
	vec4 mp = texture2D(backbuffer, vec2(0));
	if(length(gl_FragCoord) <= 16.){
		mp.xy += normalize(mouse-mp.xy)/128.;
		gl_FragColor = mp;
		return;
	}
	if(length(gl_FragCoord) <= 32.){
		gl_FragColor = vec4(0);
		return;
	}
	vec2 mouse = mp.xy;
	
	vec2 frag_pos = gl_FragCoord.xy / resolution.xy;
	float px_size = 1.0 / resolution.x;

	vec3 blur = vec3(0.0);
	row(-2,  0.007004, 0.020338, 0.029004, 0.020338, 0.007004);
	row(-1,  0.020338, 0.05906,  0.084226, 0.05906,  0.020338);
	row( 0,  0.029004, 0.084226, 0.120116, 0.084226, 0.029004);
	row( 1,  0.020338, 0.05906,  0.084226, 0.05906,  0.020338);
	row( 2,  0.007004, 0.020338, 0.029004, 0.020338, 0.007004);	
	    
	    
	vec3 color = blur * 0.999;
	
	float pulserate = 1.2 + (0.14 * cos(time * 3.0));
	float pulse = time * pulserate;
	float pulsemag = 4.0;
	float drawpulse = (sin(pulserate) + 1.0) / 2.0;
	float drawmag = 12.0;
	float drawsize = ((drawmag + (drawpulse * pulsemag)) * px_size);
	float ringsize = drawsize + px_size;
	vec3 ringcolor = vec3(1.0);
	
	float d = distance(frag_pos, mouse);
	
	if (d < drawsize) {
		float r = d / drawsize;
		float hue = time / 10.0;
		vec3 drawcolor = hsv2rgb(vec3(hue, drawpulse, cos(r)));
		color = drawcolor;
	} else {
		if (d < ringsize) {
			color = ringcolor;
		}
	}

	gl_FragColor = vec4(color, 1.0);	
}