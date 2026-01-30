#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// This is a starfield that should adapt itself to screen resolution, big or small

float starrand(float seedx, float seedy, int seedp) {
	return 0.05 + 0.9 * fract(sin(float(seedp)*437.234)*374.2542-cos(seedx*432.252)*623.643+sin(seedy*73.2454)*372.23455);
}

void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution.xy;
	position.y *= resolution.y/resolution.x;
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	
	for (int p=0; p<20; p++) {
		// divide scren into squares, smaller every pass
		float scale = 10.0 + float(p);
		vec2 vpos = position * scale;
		vpos.x += (time+385.3456) / scale;
		vpos.y += 0.1 * time / scale;

		// Randomly place star within a square, localized to the sqaure this pixel is in
		vec2 spos = vec2(starrand(floor(vpos.x), floor(vpos.y), p), starrand(10.5+floor(vpos.x), 10.5+floor(vpos.y), p));

		// Calculate size of star
		float px = scale / resolution.x / 3.0;
		float size = 1.0 / (scale*25.0);
		float brite = 1.0;
		
		// If less than ~1px, fade instead of shrink
		if (size < px) {
			brite = size/px;
			size = px;
		}
		
		// Apply star to output buffer, if near
		gl_FragColor.rgb += min(1.0, max(0.0, 4.0-length(spos-fract(vpos))/size)) * brite;
	}
}