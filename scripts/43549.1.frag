#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define DATA_PIXEL vec2(0.5, 0.5)
#define BYTE_FRACTION 1.0/256.0

/*

Data in backbuffer
Elements in gl_FragColor seem to actually be stored as bytes
So to make things smooth, I went from 8 bits to 16 bits precision by storing the dot X position in xz and the Y position in yw
If you don't want to "spoil" one pixel, you can store the data in w in several pixels as only xyz are rendered

*/
void main( void ) {
	
	vec4 data = texture2D(backbuffer, DATA_PIXEL / resolution.xy);
	if(data == vec4(0.0)) {
		data = vec4(0.5, 0.5, 0.0, 0.0); // initial position
	}
	
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	vec2 dotPos = data.xy + data.zw / 256.0;
	
	float len = length(pos-dotPos);
	float c = len < 0.1 ? 1.0 : 0.0;
	vec3 color = vec3(c);
	
	if(gl_FragCoord.xy == DATA_PIXEL) {
		vec2 delta = mouse - dotPos;
		if(length(delta) > 0.0001) {
			data.zw += normalize(delta) * 0.3;
			// Assuming zw never jumps to above 2 or bellow -1, otherwise fract/floor/ceil would have been used
			if (data.z > 1.0) {
				data.z = data.z-1.0;
				data.x += BYTE_FRACTION;
			}
			else if (data.z < 0.0) {
				data.z = data.z+1.0;
				data.x -= BYTE_FRACTION;
			}
			
			if (data.w > 1.0) {
				data.w = data.w-1.0;
				data.y += BYTE_FRACTION;
			}
			else if (data.w < 0.0) {
				data.w = data.w+1.0;
				data.y -= BYTE_FRACTION;
			}
		}
		gl_FragColor = vec4(data);
	}
	else {
		gl_FragColor = vec4(color, 1.0);
	}

}